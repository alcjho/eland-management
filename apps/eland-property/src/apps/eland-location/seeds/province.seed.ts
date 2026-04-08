import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../entities/province.entity';
import { Country } from '../entities/country.entity';

@Injectable()
export class ProvinceSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async onModuleInit() {
    Logger.log(
      "\x1b[33m[ElandLocationModule]\x1b[32m 🚀 Running Database Seeder for Location service...",
    );

    const existingProvinces = await this.provinceRepository.count();
    if (existingProvinces > 0) {
      Logger.log(
        "\x1b[33m[ElandLocationModule]\x1b[32m ✅ Provinces already seeded!",
      );
      return;
    }

    const country = await this.countryRepository.findOne({
      where: { code: 'CA' },
    });

    if (!country) {
      Logger.error(
        "\x1b[31m[ElandLocationModule]\x1b[31m ❌ Canada country not found!",
      );
      return;
    }

    const provinces = [
      { name: { fr: 'Québec', en: 'Quebec' }, code: 'QC' },
      { name: { fr: 'Ontario', en: 'Ontario' }, code: 'ON' },
      {
        name: { fr: 'Île-du-Prince-Édouard', en: 'Prince Edward Island' },
        code: 'PE',
      },
      { name: { fr: 'Nouveau-Brunswick', en: 'New Brunswick' }, code: 'NB' },
      { name: { fr: 'Nouvelle-Écosse', en: 'Nova Scotia' }, code: 'NS' },
      { name: { fr: 'Manitoba', en: 'Manitoba' }, code: 'MB' },
      { name: { fr: 'Saskatchewan', en: 'Saskatchewan' }, code: 'SK' },
      { name: { fr: 'Alberta', en: 'Alberta' }, code: 'AB' },
      {
        name: { fr: 'Colombie-Britannique', en: 'British Columbia' },
        code: 'BC',
      },
      {
        name: { fr: 'Terre-Neuve-et-Labrador', en: 'Newfoundland and Labrador' },
        code: 'NL',
      },
      { name: { fr: 'Yukon', en: 'Yukon' }, code: 'YT' },
      {
        name: { fr: 'Territoires du Nord-ouest', en: 'Northwest Territories' },
        code: 'NT',
      },
      { name: { fr: 'Nunavut', en: 'Nunavut' }, code: 'NU' },
    ];

    for (const provinceData of provinces) {
      const province = this.provinceRepository.create({
        ...provinceData,
        country,
      });
      await this.provinceRepository.save(province);
    }

    Logger.log(
      "\x1b[33m[ElandLocationModule]\x1b[32m ✅ Provinces seeded successfully!",
    );
  }
}