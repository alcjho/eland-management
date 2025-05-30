import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ElandAuthModule } from './eland-auth.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ElandAuthModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 5001
    }
  });
  
  app.listen().then(() => {
    new Logger('ElandAuthMicroservice').log('Microservice eland-auth is listening on port 5001');
  });
}
bootstrap();