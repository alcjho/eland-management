import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose'; 
export enum StorageType {
    lease_agreement, 
    renewal_notice, 
    termination_request, 
    tax_document
}
export type StorageDocument = Storage & Document

@Schema({ timestamps: true })
export class Storage {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: string;

  @Prop({ type: String, enum: StorageType, required: true })
  type: string;

  @Prop({ type: String, required: true })
  fileUrl: string; // Location of the document file

  @Prop({ type: Date })
  expiryDate?: Date;
}

export const StorageSchema = SchemaFactory.createForClass(Storage)