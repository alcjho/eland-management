import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { loadAllConfigs } from './utilities';
import { ModuleRef } from '@nestjs/core';
import { connect } from 'rabbit-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef, 
    private readonly configService: ConfigService
  ) {}

  private serviceMap: {cmd: string, service: string, type: string}[];

  onModuleInit() {
    this.serviceMap = loadAllConfigs();
  }

  async forwardToService(cmd: string, method: string, url: string, body: any, headers: any) {
    const data : any = this.serviceMap.find((endpoint) => endpoint.cmd == cmd);
    const { service: serviceLabel, type } = data;

  
    if (type === "tcp") {
      // ✅ Handle RPC request (ClientProxy)
      const client = this.moduleRef.get<ClientProxy>(serviceLabel, { strict: false });

      if (!client) {
        throw new RpcException(`No client found for service label: ${serviceLabel}`);
      }

      const pattern = { cmd };
      const payload = { method, url, body, headers };

      Logger.log(`\x1b[33m[AppService]\x1b[32m Forwarding ${method} api/${cmd} to ${serviceLabel}`);
      return lastValueFrom(client.send(pattern, payload));
    }
  }
}