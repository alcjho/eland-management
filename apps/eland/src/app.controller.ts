import { All, BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { cleanUrl, extractContextAndData, extractParameter, extractPathParams, extractSubject, extractTcpCommand, getReqConfig, getStaticPath, getTcpConfig, loadAllConfigs } from './utilities';
import { HTTP_SERVICE_CONFIG_MAP } from './tokens';
import { ServiceConfig } from './interfaces/serviceMap.interface';
import { ConfigService } from '@nestjs/config';

@Controller('main')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @Inject(HTTP_SERVICE_CONFIG_MAP) 
        private readonly httpServiceConfigMap: Map<string, any>
  ) {}

  @All('*path')
  async forwardRequest(@Req() req: Request, @Res() res: Response) {
    const method = req.method;
    const headers = req.headers;
    const originalUrl = req.url;
    let bodyPayload = {};
    let response: any = null;
    const downstreamUrl = cleanUrl(originalUrl);
    const httpConfig: ServiceConfig = getReqConfig(downstreamUrl, method);
    const tcpConfig: ServiceConfig = getTcpConfig(downstreamUrl, method);
    
    const config = httpConfig || tcpConfig;
    if(!config){
      throw new NotFoundException("Route not found on API gateway");
    }

    const requestStrategies = {
      stream: async () => {
          return (await this.appService.forwardFileStream(config, req, res, headers));
      }, 
      http: async () => {
          
          if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
              bodyPayload = req.body;
          }

          const safeHeaders = Object.keys(headers).reduce((acc, key) => {
              const lowerKey = key.toLowerCase();
              if (!['host', 'connection', 'content-length', 'expect', 'accept-encoding'].includes(lowerKey)) {
                  acc[key] = headers[key];
              }
              return acc;
          }, {});

          return (await this.appService?.forwardHTTPToService(config, method, originalUrl, bodyPayload, safeHeaders));
      }, 
      tcp: async () => {
          const params = extractPathParams(downstreamUrl, tcpConfig.path);
          const context = extractContextAndData(req);
          const payload = { 
            cmd: tcpConfig.cmd, 
            service: tcpConfig.service,
            params,
            ...context
          };
          
          return (await this.appService?.forwardRPCToService(config.cmd, method, payload));
      },
      default: (url: string = null) => {
          throw new BadRequestException(`No valid transport strategy found for target: ${url}`);
      }
    }

    
    try{
      const strategy = requestStrategies[config.type]
      response = await strategy();

      if (config.type === 'stream' && (response === undefined || response === null)) {
          return; 
      }
      
      res.status(Number(response?.status ?? 200)).send(response);

    }catch(e){
      res.status(500).send(e)
    }
  }
}
