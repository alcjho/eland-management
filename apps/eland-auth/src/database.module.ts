import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './utilities';

// Entities - Auth
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Manager } from './entities/manager.entity';
import { Owner } from './entities/owner.entity';
import { Tenant } from './entities/tenant.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: [ getEnvPath("eland-auth"), getEnvPath() ]
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
          entities: [User, Role, Manager, Owner, Tenant],
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE') ?? false,
          logging: configService.get<boolean>('DB_LOGGING') ?? false,
        };
      },
      inject: [ConfigService],
    }),
    
  ],
  providers: [],
})
export class DatabaseModule {}