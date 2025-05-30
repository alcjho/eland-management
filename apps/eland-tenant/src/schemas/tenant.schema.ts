import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose'; 
import { Notification } from './notification.schema';
import { Storage } from './storage.schema';

export type TenantDocument = Tenant & Document;
enum EarningCycle {
  MONTHLY="Monthly",
  YEARLY="Yearly",
  HOURLY="Hourly"
}

enum JobType {
  BUSINESS="Business Owner",
  EMPLOYEE="Employee",
  CONTRACTOR="Contractor"
}

enum Industry {
  TECHNOLOGY="Technology",
  HEALTHCARE="Healthcare",
  FINANCE="Finance",
  MANUFACTURING="Manufacturing",
  GOODS="Retail/Consumer Goods",
  ENERGY="Energy",
  REALESTATE="Real estate",
  OTHER="Other"
}

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true})
  prevAddress: string

  @Prop({ required: true })
  cellPhone: string

  @Prop({ required: true })
  homePhone: string
  
  @Prop({ required: true })
  contactPhone: string

  @Prop({ required: true })
  dependents: number
  
  @Prop({ required: true })
  occupants: number

  @Prop({ required: true, enum: Industry })
  industry: string;

  @Prop({ required: true, enum: JobType })
  jobType: string

  @Prop({ required: true, enum: EarningCycle })
  earningCycle: string

  @Prop({ required: true })
  earning: number

  @Prop({ required: false })
  workPhone: string

  @Prop({ required: false })
  company: string

  @Prop({ required: false })
  jobTitle: string

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'PaymentNotification' }])
  notifications: Notification[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Storage' }])
  documents: Storage[];
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);