import { NestFactory } from '@nestjs/core';
import { ElandPropertyModule } from './eland-property.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ElandPropertyModule, {
    transport: Transport.TCP,
    options: {
      host: "127.0.0.1",
      port: 5003
    }
  });
  app.listen().then((port) => {
      new Logger('ElandAuthMicroservice').log('Microservice eland-auth is listening on port 5003');
  });
}
bootstrap();
