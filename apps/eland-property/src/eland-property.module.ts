import { Module } from '@nestjs/common';
import { ElandPropertyController } from './eland-property.controller';
import { ElandPropertyService } from './eland-property.service';
import { DatabaseModule } from './database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElandMailModule } from '@eland/eland-library/eland-mail.module';
import { getEnvPath } from './utilities';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ElandLocationModule } from './apps/eland-location/eland-location.module';

// Entities
import { Property } from './entities/property.entity';
import { Lodge } from './entities/lodge.entity';
import { Parking } from './entities/parking.entity';
import { Amenity } from './entities/amenity.entity';
import { Possession } from './entities/possession.entity';
import { Bedroom } from './entities/bedroom.entity';
import { Room } from './entities/room.entity';
import { Album } from './entities/album.entity';

// Services & Strategies
import { ParkingService } from './services/parking/parking.service';
import { LodgeService } from './services/lodge/lodge.service';
import { Logger } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AbilityFactory } from './ability.factory';

@Module({
  imports: [
    DatabaseModule,
    ElandMailModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '45m' }
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ getEnvPath("eland-property"), getEnvPath() ]
    }),
    TypeOrmModule.forFeature([
      Property,
      Lodge,
      Parking,
      Amenity,
      Possession,
      Bedroom,
      Room,
      Album
    ]),
    ElandLocationModule
  ],
  controllers: [ElandPropertyController],
  providers: [
    ElandPropertyService, 
    ParkingService,
    LodgeService,
    ConfigService,
    Logger,
    JwtStrategy,
    AbilityFactory
  ],
  exports: [ElandLocationModule]
})
export class ElandPropertyModule {}
