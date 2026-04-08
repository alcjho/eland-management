import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElandAuthController } from './eland-auth.controller';
import { ElandAuthService } from './eland-auth.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Tenant } from './entities/tenant.entity';
import { Manager } from './entities/manager.entity';
import { Owner } from './entities/owner.entity';
import { ElandMailModule } from '@eland/eland-library/eland-mail.module';
import { SeederService } from './seeds/seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Tenant, Manager, Owner]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    ElandMailModule,
  ],
  controllers: [ElandAuthController],
  providers: [SeederService, ElandAuthService],
  exports: [TypeOrmModule, ElandAuthService, JwtModule],
})
export class ElandAuthModule {}