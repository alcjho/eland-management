// src/documents/documents.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElandFilesController } from './eland-files.controller';
import { ElandFilesService } from './eland-files.service';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';
import { STORAGE_SERVICE_TOKEN } from './interfaces/storage.interface';
import { getEnvPath } from './utilities';
import { DatabaseModule } from './database.module';
import { GatewayAuthGuard } from './guards/document.guard';
import { PublicController } from './public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { ProtectedDocument } from './entities/protected-document.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

// 1. Define the custom provider factory
const storageServiceProvider = {
  provide: STORAGE_SERVICE_TOKEN,
  useFactory: (configService: ConfigService) => {
    const mode = configService.get<string>('STORAGE_MODE');

    if (mode === 's3') {
      return new S3StorageService(configService);
    } 
    // Default to local storage
    return new LocalStorageService(configService); 
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '45m' } // Adjust as needed
      }),
      inject: [ConfigService]
    }), 

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ getEnvPath("eland-files"), getEnvPath() ]
    }),
    TypeOrmModule.forFeature([
      Album, 
      ProtectedDocument
    ])
  ],
  
  controllers: [ElandFilesController, PublicController],
  providers: [
    storageServiceProvider, // <-- Dynamic strategy injection
    ElandFilesService,       // <-- Core logic service
    LocalStorageService,    // Make sure both are available for the factory
    //S3StorageService,       // (Though only one will be used via the token)
    GatewayAuthGuard,
    JwtStrategy
  ],
  exports: [ElandFilesService],
})

export class ElandFilesModule {}