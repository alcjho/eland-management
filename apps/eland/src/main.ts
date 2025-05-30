import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000
  app.listen(port).then (() => {
    new Logger("APIGateway").log(`API Gateway microservice is listening on port ${port}`)
  });
}
bootstrap();
