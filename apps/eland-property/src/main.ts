import { NestFactory } from '@nestjs/core';
import { ElandPropertyModule } from './eland-property.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  // Create HTTP server
  const app = await NestFactory.create(ElandPropertyModule);
  
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  
  // Also connect microservice transport (TCP) for microservice communication
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 5003
    }
  });

  app.enableCors({
    origin: [
        `http://localhost:4200`
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-roles'],
    credentials: true,
  });

  // Start both HTTP and microservice listeners
  await app.startAllMicroservices();
  await app.listen(3003, '0.0.0.0');

  new Logger('ElandPropertyApp').log('HTTP server listening on port 3003');
  new Logger('ElandPropertyApp').log('Microservice listener on TCP port 5003');
}
bootstrap();
