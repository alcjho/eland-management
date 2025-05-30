import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ElandAuthController } from './eland-auth.controller';
import { ElandAuthService } from './eland-auth.service';
import { UserSchema } from './schemas/user.schema';
import { ElandMailModule } from '@eland/eland-library/eland-mail.module';
import { RoleSchema } from './schemas/role.schema';
import { DatabaseModule } from './database.module';
import { SeederService } from './seeds/seeder.service';
import { getEnvPath } from './utilities';


@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [ getEnvPath("eland-auth"), getEnvPath() ]
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Role', schema: RoleSchema}
    ]),
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
  providers: [SeederService, ElandAuthService],
})
export class ElandAuthModule {}