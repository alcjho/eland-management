import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

enum NotificationType {
    invoice_created,
    payment_confirmed,
    invoice_overdue,
    lease_expiring,
    lease_signed,
    utility_bill_due,
    tax_document_uploaded
}
@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: string;

  @Prop({ type: String, enum: NotificationType, required: true })
  notificationType: string; // Specifies the type of notification

  @Prop({ type: String, required: true })
  message: string; // Human-readable message displayed to tenant

  @Prop({ type: Boolean, default: false })
  seen: boolean; // Tracks whether tenant has viewed the notification
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);