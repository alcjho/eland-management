import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElandLocationController } from './eland-location.controller';
import { ElandLocationService } from './eland-location.service';
import { City } from './entities/city.entity';
import { Province } from './entities/province.entity';
import { Country } from './entities/country.entity';
import { Location } from './entities/location.entity';
import { CitySeed } from './seeds/city.seed';
import { CountrySeed } from './seeds/country.seed';
import { ProvinceSeed } from './seeds/province.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Province, Country, Location])
  ],
  controllers: [ElandLocationController],
  providers: [
    ElandLocationService, 
    CitySeed, 
    CountrySeed,
    ProvinceSeed 
  ],
  exports: [ElandLocationService, TypeOrmModule]
})
export class ElandLocationModule {}