import { NestFactory } from '@nestjs/core';
import { ElandLocationModule } from './eland-location.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ElandLocationModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 5002
    }
  });
  app.listen().then(() => {
      new Logger('ElandAuthMicroservice').log('Microservice eland-location is listening on port 5002');
  });
}
bootstrap();
