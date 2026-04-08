import { All, BadRequestException, Controller, ForbiddenException, NotFoundException, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { CaslGuard } from "./guards/casl.guard";
import { cleanUrl, extractContextAndData, extractParameter, extractPathParams, extractSubject, getReqConfig, getTcpConfig } from "./utilities";
import { Action, CaslAbilityFactory } from "./ability.factory";
import { ServiceConfig } from "./interfaces/serviceMap.interface";


@Controller()
export class ApiController {
    constructor(
        private readonly appService: AppService,
        private readonly caslAbility: CaslAbilityFactory
    ){}

    @All('*path')
    @UseGuards(JwtAuthGuard, CaslGuard)
    async forwardRequest(@Req() req: Request, @Res() res: Response) {
        const method = req.method;
        const headers = req.headers;
        const url = req.url;
        const downstreamUrl = cleanUrl(url);
        const subject = extractSubject(url);
        const param = extractParameter(url);
        const user: any = headers.user;
        const ability = this.caslAbility.createForUser(user);
        const originalUrl = req.url;

        
        const httpConfig: ServiceConfig = getReqConfig(url, method);
        const tcpConfig: ServiceConfig = getTcpConfig(url, method);
        
        let bodyPayload = {};
        const config = httpConfig || tcpConfig;

        if(!config){
            throw new NotFoundException("Route not found on API gateway");
        }

        // Enforce access control for password updates on other users password
        if (subject === 'Users' && config.cmd.includes('change-password') && param) {
            const isAuthorized = ability.can(Action.Update, 'Users') && user.id === param;
            if (!isAuthorized) {
                throw new ForbiddenException("You are not allowed to change another user's password");
            }
        }

        const requestStrategies = {
            stream: async () => {
                return (await this.appService.forwardFileStream(httpConfig, req, res, headers));
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

                return (await this.appService?.forwardHTTPToService(httpConfig, method, originalUrl, bodyPayload, safeHeaders));
            }, 
            tcp: async () => {
                const params = extractPathParams(url, tcpConfig.path);
                const context = extractContextAndData(req);
                const query = {};
                const payload = { 
                    cmd: tcpConfig.cmd, 
                    service: tcpConfig.service,
                    params,
                    query,
                    ...context,
                    data: req.body
                };

                return (await this.appService?.forwardRPCToService(tcpConfig.cmd, method, payload));
            },
            default: (url: string = null) => {
                throw new BadRequestException(`No valid transport strategy found for target: ${url}`);
            }
        }

        try{
            let response: any = null;
            const strategy = requestStrategies[config.type] || requestStrategies.default(url);
            response = await strategy();

            if (config.type === 'stream' && (response === undefined || response === null)) {
                return; 
            }
            
            res.status(Number(response?.status ?? 200)).send(response);
        }catch (e: any) {
            const statusCode = Number(e.response?.status || e.status) || 500;
            
            let payload = e.response?.data ?? { 
                error: e.message ?? 'An unknown server error occurred.' 
            };

            if (statusCode === 401) {
                payload = { error: 'Unauthorized – Token expired, please refresh.' };
            } 

            res.status(statusCode).send(payload);
        }
    }
}