import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { seedRoles } from './role.seed';
import { seedOwnerUser } from './user.seed';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  async onModuleInit() {
    Logger.log("\x1b[33m[ElandAuthModule]\x1b[32m 🚀 Running Database Seeder...!");
    
    try {
      const existingRoles = await this.roleRepository.count();
      if (existingRoles > 0) {
        Logger.log("\x1b[33m[ElandAuthModule]\x1b[32m ✅ Roles are already seeded!");
        return;
      }

      // Get datasource from repository to use in seed functions
      const dataSource = this.roleRepository.manager.connection;

      // Run seeds
      await seedRoles(dataSource);
      await seedOwnerUser(dataSource);

      Logger.log("\x1b[33m[ElandAuthModule]\x1b[32m ✅ Roles and users are seeded successfully!");
    } catch (error) {
      Logger.error(
        "\x1b[33m[ElandAuthModule]\x1b[31m ❌ Seeding failed: " + error.message,
        error.stack
      );
      throw error;
    }
  }
}