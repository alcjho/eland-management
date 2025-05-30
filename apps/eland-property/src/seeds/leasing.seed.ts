import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lease } from '../schemas/lease.schema';


@Injectable()
export class LeaseSeed implements OnModuleInit {
  constructor(@InjectModel('Lease') private readonly leaseModel: Model<Lease>) {}

  async onModuleInit() {
    Logger.log("\x1b[33m[ElandPropertyModule]\x1b[32m 🚀 Running Database Seeder for Property service...");

    // Check if roles exist
    const existingLease = await this.leaseModel.countDocuments();
    if (existingLease > 0) {
      Logger.log("\x1b[33m[ElandPropertyModule]\x1b[32m ✅ Leases are already seeded!");
      return;
    }

    const leases = [
        { 
          leaseStartDate: "2025-06-01",
          leaseEndDate: "2026-06-01",
          paymentCycle: "Monthly",
          payment: 1600,
          securityDeposit: 3000,
          leaseTerms: "/leases/terms/lease-id-form.pdf",
          isCurrent: true,
          leaseStatus: "active",
          leaseNote: "Pour un grand 4 1/2"
        }
    ];
    
    await this.leaseModel.insertMany(leases);
    Logger.log("\x1b[33m[ElandLocationModule]\x1b[32m ✅ Leases are seeded successfully!");
  }
}