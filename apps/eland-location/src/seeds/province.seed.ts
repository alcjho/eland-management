import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from '../schemas/city.schema';

@Injectable()
export class ProvinceSeed implements OnModuleInit {
  constructor(@InjectModel('Province') private readonly provinceModel: Model<City>) {}

  async onModuleInit() {
    Logger.log("\x1b[33m[ElandLocationModule]\x1b[32m 🚀 Running Database Seeder for Location service...");

    // Check if roles exist
    const existingProvinces = await this.provinceModel.countDocuments();
    if (existingProvinces > 0) {
      Logger.log("\x1b[33m[ElandLocationModule]\x1b[32m ✅ Provinces already seeded!");
      return;
    }

    const provinces = [
        { name: {fr: "Québec", en: "Quebec"}, code: "QC" },
        { name: {fr: "Ontario", en: "Ontario"}, code: "ON" },
        { name: {fr: "Île-du-Prince-Édouard", en: "Prince Edward Island"}, code: "PE" },
        { name: {fr: "Nouveau-Brunswick", en: "New Brunswick"}, code: "NB" },
        { name: {fr: "Nouvelle-Écosse", en: "Nova Scotia"}, code: "NS" },
        { name: {fr: "Manitoba", en: "Manitoba"}, code: "MB" },
        { name: {fr: "Saskatchewan", en: "Saskatchewan"}, code: "SK" },
        { name: {fr: "Alberta", en: "Alberta"}, code: "AB" },
        { name: {fr: "Colombie-Britannique", en: "British Columbia"}, code: "BC" },
        { name: {fr: "Terre-Neuve-et-Labrador", en: "Newfoundland and Labrador"}, code: "NL" },
        { name: {fr: "Yukon", en: "Yukon"}, code: "YT" },
        { name: {fr: "Territoires du Nord-ouest", en: "Northwest Territories"}, code: "NT" },
        { name: {fr: "Nunavut", en: "Nunavut"}, code: "NU" }
    ];

    
    await this.provinceModel.insertMany(provinces);
    Logger.log("\x1b[33m[ElandLocationModule]\x1b[32m ✅ Provinces seeded successfully!");
  }
}