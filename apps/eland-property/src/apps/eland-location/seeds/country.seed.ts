import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountrySeed implements OnModuleInit {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async onModuleInit() {
    Logger.log(
      "\x1b[33m[ElandLocationModule]\x1b[32m 🚀 Running Database Seeder for Location service...",
    );

    const existingCountries = await this.countryRepository.count();
    if (existingCountries > 0) {
      Logger.log(
        "\x1b[33m[ElandLocationModule]\x1b[32m ✅ countries are already seeded!",
      );
      return;
    }

    const countries = [
      {
        name: { fr: 'Canada', en: 'Canada' },
        code: 'CA',
      },
    ];

    for (const countryData of countries) {
      const country = this.countryRepository.create(countryData);
      await this.countryRepository.save(country);
    }

    Logger.log(
      "\x1b[33m[ElandLocationModule]\x1b[32m ✅ countries are seeded successfully!",
    );
  }
}