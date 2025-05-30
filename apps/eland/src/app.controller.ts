import { All, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*path')
  async forwardRequest(@Req() req: Request, @Res() res: Response) {
    const { method, body, headers, url, query } = req;

    // Extract cmd from the last part of the URL
    const cleanUrl = url.split('?')[0]; // Remove query parameters
    const cmd = cleanUrl.split('/').pop() ?? '/';
    
    try{
      const response = await this.appService?.forwardToService(cmd, method, url, { ...body, query }, headers);
      console.log(response)
      res.status(Number(response.status ?? 200)).send(response);
    }catch(e){
      res.status(500).send(e)
    }
  }
}
