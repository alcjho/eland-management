import { All, Controller, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./strategies/jwt.guard";

@Controller('api')
export class ApiController {
    constructor(private readonly appService: AppService){}

    @All('*path')
    @UseGuards(JwtAuthGuard)
      async forwardRequest(@Req() req: Request, @Res() res: Response) {
        const { method, body, headers, url, query, params } = req;
    
        // Extract cmd from the last part of the URL
        let cmd = url.split('?')[0];
        const urlSegments = cmd.split('/')
        if(urlSegments.length > 1){
            cmd = urlSegments[2];
        }else{
            cmd = '/';
        }
    
        try{
          const response = await this.appService?.forwardToService(cmd, method, url, { ...body, query, params }, headers);
          res.status(Number(response.status ?? 200)).send(response);
        }catch (e) {
            console.log(e)
            if (e.status === 401) {
                res.status(401).send({ error: 'Unauthorized – Token expired, please refresh.' });
            } else {
                res.status(500).send(e);
            }
        }
    }
}