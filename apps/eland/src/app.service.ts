import { Injectable, Inject, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { loadAllConfigs } from './utilities';
import { ModuleRef } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { Request, Response } from 'express';
import { ObjectId } from 'bson';
// Import the necessary token from app.module.ts
import { HTTP_SERVICE_CONFIG_MAP } from './tokens';
import { ServiceConfig } from './interfaces/serviceMap.interface'; // Assuming this interface is correct
 
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef, 
    private readonly httpService: HttpService, 
    @Inject(HTTP_SERVICE_CONFIG_MAP) 
    private readonly httpServiceConfigMap: Map<string, any>
  ) {}

  private serviceMap: {cmd: string, service: string, type: string}[];
  private readonly logger = new Logger(AppService.name)
  onModuleInit() {
    this.serviceMap = loadAllConfigs();
    
  }

  async forwardMulterUpload(
    config: ServiceConfig, 
    requestUrl: string, 
    file: Express.Multer.File, 
    metadata: Record<string, any> // Includes fileId, entityId, etc.
) {
    const targetUrl = this.resolveServiceUrl(config, requestUrl);
    const form = new FormData();

    // 1. Append the file buffer and metadata
    form.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size,
    });

    for (const key in metadata) {
        if (metadata.hasOwnProperty(key)) {
            form.append(key, String(metadata[key])); 
        }
    }

    const axiosConfig: AxiosRequestConfig = {
        method: 'POST',
        url: targetUrl,
        data: form, // Send the NEW FormData object
        headers: {
            ...form.getHeaders(), // CRITICAL: Sets the 'Content-Type: multipart/form-data; boundary=...'
        },
        maxContentLength: Infinity, 
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios.request(axiosConfig);
        return { status: response.status, data: response.data };
    } catch (error: any) {
        // Use your improved error handling logic here
        if (error.response) {
            return { status: error.response.status, data: error.response.data };
        }
        throw error;
    }
  }
  
  

  async forwardRPCToService(cmd: string, method: string, body: any) {
    const data : any = this.serviceMap.find((endpoint) => endpoint.cmd == cmd);
    
    if(!data){
        return {
          status: 401,
          message: "Unknown resource or malformed url. Expecting /api/<subject>/<action>/"
        }
    }
    
    const { service: serviceLabel, type } = data;
    // Uses ModuleRef to dynamically get the client (no need to inject them all)
    const client = this.moduleRef.get<ClientProxy>(serviceLabel, { strict: false }); 

    if (!client) {
        throw new RpcException(`No client found for service label: ${serviceLabel}`);
    }

    const pattern = { cmd };
    const payload = { ...body };

    Logger.log(`\x1b[33m[APIGateway]\x1b[32m Forwarding ${method} ${cmd} to ${serviceLabel}`);
    return lastValueFrom(client.send(pattern, payload));
  }


  // FIX: Updated to use config.service and resolveServiceUrl, eliminating config.root usage
  async forwardHTTPToService(config: ServiceConfig, method: string, url: string, body: any, headers: any) {
    const fullUrl = this.resolveServiceUrl(config, url);
    const outgoingHeaders = this.serializeHeaders(headers, fullUrl);

    // Note: The config object should be passed from the ApiController and contains the cmd, service, and type.
    const data : any = this.serviceMap.find((endpoint) => endpoint.cmd == config.cmd);
    let response: any = null;

    if(!data){
      return {
        status: 401,
        message: "Unknown resource or malformed url. Expecting /api/<subject>/<action>/"
      }
    }

    try {
        const reqdata = {
          method: method as any, 
          url: fullUrl, // Use the resolved full URL
          data: body,
          headers: outgoingHeaders,
        }
        response = await lastValueFrom(
            this.httpService.request(reqdata)
        );

    } catch (error) {
        // ... Error handling remains the same
        throw error
    }

    return {
      status: response?.status,
      data: response?.data,
      headers: response?.headers,
    };
  }

  // FIX: Updated to use config.service and resolveServiceUrl, eliminating config.root usage
  async forwardFileStream(config: ServiceConfig, req: Request, res: Response, headers: any) {
    // FIX: Resolve the full target URL dynamically using config.service
    let targetUrl = this.resolveServiceUrl(config, req.url);
    
    if(config.path.endsWith('/upload/:fileId')){
      const newFileId = (new ObjectId()).toHexString();
      targetUrl += `/${newFileId}`;
    }
    const outgoingHeaders = this.serializeHeaders(headers, targetUrl);
    
    const httpConfig: AxiosRequestConfig = {
        method: req.method as any,
        url: targetUrl,
        headers: outgoingHeaders,
        data: req, 
        responseType: 'stream',
    };
    
    try {
    
        // Uses axios directly for streaming to allow the pipe
        const response = await axios.request(httpConfig);
        res.status(response.status);

        Object.keys(response.headers).forEach(key => {
            res.setHeader(key, response.headers[key] as string | string[]);
        });

        response.data.pipe(res);
    } catch (error) {
        // ... Error handling remains the same
        const status = error.response?.status || 500;
        const data = error.response?.data || { error: error.message || 'Error forwarding stream' };
        
        res.status(status);
        
        if (data instanceof require('stream').Readable) {
            res.send({ error: `Downstream (${error.message})` });
        } else {
            res.send(data);
        }
        
        return;
    }
  }

  genFileIdForUpload(config: ServiceConfig, targetUrl: string){
    if(config.path.endsWith('/upload/:fileId')){
      const newFileId = (new ObjectId()).toHexString();
      
      return targetUrl += `/${newFileId}`;
    }else{
      return targetUrl;
    }
  }

  // New helper function to dynamically resolve the target URL
  private resolveServiceUrl(config: ServiceConfig, requestUrl: string): string {
    const serviceLabel = config.service;
    const serviceConfig = this.httpServiceConfigMap.get(serviceLabel);

    if (!serviceConfig) {
        throw new BadRequestException(`HTTP service not found for label: ${serviceLabel}`);
    }

    // Get the baseURL from microservices.json
    const baseURL = serviceConfig.options.baseURL as string; 
    const pathAfterGateway = requestUrl.replace(/^\/api/, ''); 
    const cleanMainSegment = pathAfterGateway.replace(/^\/main/, '');
    const normalizedBase = baseURL.replace(/\/+$/, '');
    const normalizedPath = cleanMainSegment.replace(/^\/+/, '');
    
    return `${normalizedBase}/${normalizedPath}`.replace(/^\/|\/$/g, '')

  }

  serializeHeaders(headers: any, targetUrl: string){
    const serializedUser = JSON.stringify(headers['user']);
    const user = headers['user'];
    if(!user)
      return headers;

    return {
        ...headers,
        user: serializedUser,
        'host': new URL(targetUrl).host,
        'content-type': headers['content-type'],
        'x-owner-id': user['ownerId'],
        'x-user-id': user['id'], 
        'x-user-roles': user.role
    };
  }

}