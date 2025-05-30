import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RevenueDocument = Revenue & Document;

@Schema({ timestamps: true })
export class Revenue {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  tenantId?: string;

  @Prop({ type: String, enum: ['rent', 'amenities', 'parking', 'other'], required: true })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: String, enum: ['paid', 'pending'], default: 'pending' })
  paymentStatus: string;

  @Prop({ type: Date, default: Date.now })
  paymentDate: Date;
}

export const RevenueSchema = SchemaFactory.createForClass(Revenue);