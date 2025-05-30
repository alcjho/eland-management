import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './utilities';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: [ getEnvPath("eland-tenant"), getEnvPath() ]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI environment variable is not defined');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}