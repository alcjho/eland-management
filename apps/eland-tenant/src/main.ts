import { NestFactory } from '@nestjs/core';
import { ElandTenantModule } from './eland-tenant.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { rabbitMQConfig } from './config/rmq.config';

async function bootstrap() {
  const app = await NestFactory.create(ElandTenantModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 5004);

  // // connect RabbitMQ microservice from configuration
  app.connectMicroservice(rabbitMQConfig);

  // TCP protocol for secure communication between services
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: "127.0.0.1",
      port: 5004
    }
  });
  app.startAllMicroservices();
  
  new Logger('ElandTenantMicroservice').log(`ElandTenant Microservice is listening on port ${port}`);
  new Logger('RabbitMQMicroservice').log('RabbitMQ Microservice is listening on default port 5672');
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});