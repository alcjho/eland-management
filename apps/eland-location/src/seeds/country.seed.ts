import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from '../schemas/city.schema';
import { Country } from '../schemas/country.schema';
import { Province } from '../schemas/province.schema';
import { Location } from '../schemas/location.schema';


@Injectable()
export class CountrySeed implements OnModuleInit {
  constructor(@InjectModel('Country') private readonly countryModel: Model<City>) {}

  async onModuleInit() {
    Logger.log("\x1b[33m[ElandLocationModule]\x1b[32m 🚀 Running Database Seeder for Location service...");

    // Check if roles exist
    const existingCountries = await this.countryModel.countDocuments();
    if (existingCountries > 0) {
      Logger.log("\x1b[33m[ElandLocationModule]\x1b[32m ✅ countries are already seeded!");
      return;
    }

    const countries = [
        { 
          name: { fr: "Canada", "en": "Canada" },
          code: "CA"
        }
    ];
    
    await this.countryModel.insertMany(countries);
    Logger.log("\x1b[33m[ElandLocationModule]\x1b[32m ✅ countries are seeded successfully!");
  }
}