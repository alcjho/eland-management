import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: string;

  @Prop({ type: String, enum: ['payment.processing', 'payment.confirmed', 'payment.late', 'custom'], required: true })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Date, default: Date.now })
  sentAt: Date;

  @Prop({ default: false })
  seen: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  eventRefId?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);