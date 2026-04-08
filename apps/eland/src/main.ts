// src/main.ts

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import for better Express typing
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { getReqConfig, loadAllConfigs } from './utilities';
import * as express from 'express';

const logger = new Logger();

async function bootstrap() {
    
    // Explicitly create the app with NestExpressApplication for stream access
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const port = process.env.PORT ?? 3000;
    
    // Check if the route is NOT a stream route
    const skipBodyParser = (req: express.Request) => {
        const config = getReqConfig(req.originalUrl); 
        return config && config.type === 'stream';
    };

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (skipBodyParser(req)) {
            logger.warn(`Skipping body parsing for stream route: ${req.url}`);
            // CRITICAL: Call next() immediately to bypass the body parser middleware below
            return next();
        }
        next();
    });

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    app.setGlobalPrefix('api', {
        exclude: [
            'auth/*path',
            'api/main/*path',
            'public/*path'
        ],
    });

    app.enableCors({
        origin: [
            `http://localhost:${port}`, 
            `http://localhost:4200`
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-roles'],
        credentials: true,
    });

    app.listen(port).then (() => {
      new Logger("APIGateway").log(`API Gateway microservice is listening on port ${port}`)
    });
}

bootstrap();