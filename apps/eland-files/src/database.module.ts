import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './utilities';
import { Album } from './entities/album.entity';
import { ProtectedDocument } from './entities/protected-document.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: [ getEnvPath("eland-files"), getEnvPath() ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [ Album, ProtectedDocument ],
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE') ?? false,
          logging: configService.get<boolean>('DB_LOGGING') ?? false,
        };
      },
      inject: [ConfigService]
    })
  ],
})
export class DatabaseModule {}