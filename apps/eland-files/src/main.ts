import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { ElandFilesModule } from './eland-files.module';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

const logger = new Logger('ElandFilesService');

function ensureDirectoryExists(path: string, logger: Logger){
  const resolvedPath = resolve(path);
  if(!resolvedPath){
    logger.error('File root paths is undefined. Check .env configuration');
  }
  if(!existsSync(resolvedPath)){
    try{
      mkdirSync(resolvedPath, { recursive: true });
    }catch (e){
      logger.error(`Failed to create directory ${resolvedPath}: ${e.message}`)
    }
  }else{
    logger.warn(`File root paths ${resolvedPath} already exists. Skipping creation`)
  }
}

async function bootstrap() {
  const app = await NestFactory.create(ElandFilesModule)
  const configService = app.get(ConfigService);
  const port = configService.get<number>('HTTP_PORT');
  const protected_assets_root = configService.get<string>('PROTECTED_DOCUMENT_ROOT');
  const public_assets_root = configService.get<string>('PUBLIC_ASSETS_ROOT');
  const url = configService.get<string>('FILES_SERVICE_PUBLIC_URL');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: [
        `http://localhost:4200`
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-roles'],
    credentials: true,
  });
    
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  ensureDirectoryExists(protected_assets_root, new Logger('ElandFilesService'));
  ensureDirectoryExists(public_assets_root, new Logger('ElandFilesService'));

  if(public_assets_root){
    app.use('/files/public-assets', express.static(public_assets_root))
    logger.log(`Serving static assets from ${public_assets_root}`)
  }

  app.listen(port).then(() => {
      logger.log(`HTTP server for eland-files is accessible from localhost:${port}`);
  });
}
bootstrap();
