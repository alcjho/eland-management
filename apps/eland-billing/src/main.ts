import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ElandBillingModule } from './eland-billing.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { rabbitMQConfig } from './rmq.options';

async function bootstrap() {
  // Create the main HTTP application
  const app = await NestFactory.create(ElandBillingModule);
  
  // Get ConfigService instance
  const configService = app.get(ConfigService);
  const mqHost = configService.get('MQHOST');
  const port = configService.get('PORT', 5005);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
        host: "127.0.0.1",
      port: 5005
    },
  });

  // Start both HTTP server and microservice
  await app.startAllMicroservices();
  new Logger('ElandBillingMicroservice').log(`ElandBilling Microservice is listening on port ${port}`);
  new Logger('RabbitMQMicroservice').log('RabbitMQ Microservice is listening on default port 5672');
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
