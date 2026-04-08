import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './utilities';

// Entities - Property
import { Property } from './entities/property.entity';
import { Lodge } from './entities/lodge.entity';
import { Parking } from './entities/parking.entity';
import { Amenity } from './entities/amenity.entity';
import { Possession } from './entities/possession.entity';
import { Bedroom } from './entities/bedroom.entity';
import { Room } from './entities/room.entity';
import { Album } from './entities/album.entity';

// Entities - Location
import { City } from './apps/eland-location/entities/city.entity';
import { Province } from './apps/eland-location/entities/province.entity';
import { Country } from './apps/eland-location/entities/country.entity';
import { Location } from './apps/eland-location/entities/location.entity';

// Entities - Auth
import { User } from './apps/eland-auth/entities/user.entity';
import { Role } from './apps/eland-auth/entities/role.entity';
import { Tenant } from './apps/eland-auth/entities/tenant.entity';
import { Manager } from './apps/eland-auth/entities/manager.entity';
import { Owner } from './apps/eland-auth/entities/owner.entity';

// Modules
import { ElandLocationModule } from './apps/eland-location/eland-location.module';
import { ElandLeaseModule } from './apps/eland-lease/eland-lease.module';
import { ElandBillingModule } from './apps/eland-billing/eland-billing.module';
import { ElandTenantModule } from './apps/eland-tenant/eland-tenant.module';
import { ElandAuthModule } from './apps/eland-auth/eland-auth.module';
import { PossessionService } from './services/possession/possession.service';
import { BedroomService } from './services/bedroom/bedroom.service';
import { RoomService } from './services/room/room.service';
import { AmenityService } from './services/amenity/amenity.service';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: [ getEnvPath("eland-property"), getEnvPath() ]
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
          entities: [Property, Lodge, Parking, Amenity, Possession, Bedroom, Room, Album, City, Province, Country, Location, User, Role, Tenant, Manager, Owner],
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE') ?? false,
          logging: configService.get<boolean>('DB_LOGGING') ?? false,
        };
      },
      inject: [ConfigService],
    }),
    ElandLocationModule,
    ElandTenantModule,
    ElandLeaseModule,
    ElandBillingModule,
    ElandAuthModule,
  ],
  providers: [PossessionService, BedroomService, RoomService, AmenityService],
})
export class DatabaseModule {}