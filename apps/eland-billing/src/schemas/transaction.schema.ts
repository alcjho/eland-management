import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: string;

  @Prop({ required: true })
  amountPaid: number;

  @Prop({ type: String, enum: ['credit_card', 'bank_transfer', 'cash'], required: true })
  paymentMethod: string;

  @Prop({ type: Date, default: Date.now })
  transactionDate: Date;

  @Prop({ type: String, enum: ['rent', 'debt', 'fees'], required: true })
  relatedTo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  referenceId?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);