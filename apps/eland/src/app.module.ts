import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiController } from './api.controller';
import { getEnvPath, loadServices } from './utilities';
  
  const services = loadServices();
  @Module({
    imports: [
      ClientsModule.register(
        services.map(service => ({
          name: service.name,
          transport: Transport[service.transport],
          options: service.options
        }))
      ),
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
    providers: [AppService, JwtStrategy],
  })
  export class AppModule {}
