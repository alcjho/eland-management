import { Module } from '@nestjs/common';
import { ElandLocationController } from './eland-location.controller';
import { ElandLocationService } from './eland-location.service';
import { DatabaseModule } from './database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceSchema } from './schemas/province.schema';
import { CitySchema } from './schemas/city.schema';
import { CountrySchema } from './schemas/country.schema';
import { LocationSchema } from './schemas/location.schema';
import { CitySeed } from './seeds/city.seed';
import { CountrySeed } from './seeds/country.seed';
import { ProvinceSeed } from './seeds/province.seed';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'City', schema: CitySchema },
      { name: 'Province', schema: ProvinceSchema },
      { name: 'Country', schema: CountrySchema },
      { name: 'Location', schema: LocationSchema },
    ])
  ],
  controllers: [ElandLocationController],
  providers: [
    ElandLocationService, 
    CitySeed, 
    CountrySeed,
    ProvinceSeed 
  ]
})
export class ElandLocationModule {}
