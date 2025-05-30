import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../schemas/role.schema';
import { Permissions } from '../schemas/role.schema';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {}

  async onModuleInit() {
    Logger.log("\x1b[33m[ElandAuthModule]\x1b[32m 🚀 Running Database Seeder...!");
    // Check if roles exist
    const existingRoles = await this.roleModel.countDocuments();
    if (existingRoles > 0) {
      Logger.log("\x1b[33m[ElandAuthModule]\x1b[32m ✅ Roles are already seeded!");
      return;
    }

    // Insert default roles
    const roles = [
      { name: "admin", permissions: Permissions.write },
      { name: "agent", permissions: Permissions.read }
    ];
    
    await this.roleModel.insertMany(roles);
    Logger.log("\x1b[33m[ElandAuthModule]\x1b[32m ✅ Roles are seeded successfully!");
  }
}