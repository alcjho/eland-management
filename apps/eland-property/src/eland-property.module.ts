import { Module } from '@nestjs/common';
import { ElandPropertyController } from './eland-property.controller';
import { ElandPropertyService } from './eland-property.service';
import { DatabaseModule } from './database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ElandMailModule } from '@eland/eland-library/eland-mail.module';
import { getEnvPath } from './utilities';
import { AmenitySchema } from './schemas/amenity.schema';
import { LodgeSchema } from './schemas/lodge.schema';
import { ParkingSchema } from './schemas/parking.schema';
import { PossessionSchema } from './schemas/possession.schema';
import { PropertySchema } from './schemas/property.schema';
import { RoomSchema } from './schemas/room.schema';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LeaseSeed } from './seeds/leasing.seed';
import { Lease, LeaseSchema } from './schemas/lease.schema';


@Module({
  imports: [
    DatabaseModule,
    ElandMailModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ getEnvPath("eland-property"), getEnvPath() ]
    }),
    MongooseModule.forFeature([
      {name: "Amenity", schema: AmenitySchema},
      {name: "Lodge", schema: LodgeSchema},
      {name: "Parking", schema: ParkingSchema},
      {name: "Possession", schema: PossessionSchema},
      {name: "Property", schema: PropertySchema},
      {name: "Room", schema: RoomSchema},
      {name: "Lease", schema: LeaseSchema}
    ])
  ],
  controllers: [ElandPropertyController],
  providers: [
    ElandPropertyService, 
    ConfigService,
    LeaseSeed
  ],
})
export class ElandPropertyModule {}
