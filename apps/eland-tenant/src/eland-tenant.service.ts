import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { TenantDto } from './dtos/tenant.dto';

@Injectable()
export class ElandTenantService {
  constructor(
    @InjectModel("Tenant") private readonly tenantModel:Model<Tenant>,
    @InjectModel("Notification") private readonly notificationModel: Model<Notification>
  ){}

  async addTenant(userId: string, data: TenantDto) {
    const tenant = new this.tenantModel({ userId, ...data });
    const newTenant = await tenant.save();
    return { status: 201, res: newTenant };
  }

  async handlePaymentProcess(payload: any) {
    const tenant = await this.tenantModel.findOne({ userId: payload.userId })
    if(!tenant){
      new Logger.warn(`Tenant not found for userId: ${payload.userId}. Payment event cannot be processed for this user.`);
      return;
    } 
    await this.notificationModel.create({
      tenantId: payload.userId,
      notificationType: 'Payment',
      message: `We have received your payment of $${payload.amount} CAD.Thank you!`,
    });
  }
}
