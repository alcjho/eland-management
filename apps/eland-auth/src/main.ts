import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ElandAuthModule } from './eland-auth.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ElandAuthModule);
  const port = process.env.PORT ?? 3001;

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 5001
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
  await app.listen(3001, '0.0.0.0');

  new Logger('ElandPropertyApp').log('HTTP server listening on port 3001');
  new Logger('ElandPropertyApp').log('Microservice listener on TCP port 5001');
}
bootstrap();