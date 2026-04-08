import { InjectionToken, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport, TcpClientOptions } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiController } from './api.controller';
import { getEnvPath, loadServices } from './utilities';
import { CaslAbilityFactory } from './ability.factory';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TcpServiceData, HttpServiceData } from './types/services.types';
import { HTTP_SERVICE_CONFIG_MAP } from './tokens';

const services = loadServices();

// Filter services for the ClientsModule (TCP, Redis, etc.)
const microserviceClients = services
  .filter((service): service is TcpServiceData => service.transport !== 'HTTP')
  .map(service => ({
    name: service.name,
    transport: Transport.TCP,
    options: service.options,
  })) as (TcpClientOptions & { name: string })[]; // <--- ADDED ASSERTION

const httpServicesMap = new Map(
  services
    .filter((service): service is HttpServiceData => service.transport === 'HTTP')
    .map(service => [service.name, service])
  );
  
  @Module({
    imports: [
      HttpModule,
      ClientsModule.register(microserviceClients),
      ConfigModule.forRoot({ envFilePath: [ getEnvPath("eland"), getEnvPath() ]}),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' }
        }),
        inject: [ConfigService]
      })
    ],
    controllers: [AppController, ApiController],
    providers: [
      AppService, 
      JwtStrategy, 
      CaslAbilityFactory,
      Logger,
      {
        provide: HTTP_SERVICE_CONFIG_MAP,
        useFactory: () => {
        // Run the filtering logic inside the factory function
        const allServices = loadServices();
        const httpServicesMap = new Map(
            allServices
                .filter((service: any) => service.transport === 'HTTP')
                .map(service => [service.name, service])
        );
        return httpServicesMap;
      },
      }
    ],
  })
  export class AppModule {}
