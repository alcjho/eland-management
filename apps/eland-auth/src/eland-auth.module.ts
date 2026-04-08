import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ElandAuthController } from './eland-auth.controller';
import { ElandAuthService } from './eland-auth.service';
import { User } from './entities/user.entity';
import { ElandMailModule } from '@eland/eland-library/eland-mail.module';
import { Role } from './entities/role.entity';
import { DatabaseModule } from './database.module';
import { SeederService } from './seeds/seeder.service';
import { getEnvPath } from './utilities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Manager } from './entities/manager.entity';
import { Owner } from './entities/owner.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [ getEnvPath("eland-auth"), getEnvPath() ]
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Manager,
      Owner,
      Tenant
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h') 
        },
      }),
      inject: [ConfigService],
    }),
    ElandMailModule,
  ],
  controllers: [ElandAuthController],
  providers: [SeederService, ElandAuthService, JwtStrategy],
})
export class ElandAuthModule {}