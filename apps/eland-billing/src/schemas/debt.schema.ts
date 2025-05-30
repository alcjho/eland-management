import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DebtDocument = Debt & Document;

@Schema({ timestamps: true })
export class Debt {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ type: String, enum: ['electricity', 'water', 'internet', 'other'], required: true })
  category: string;

  @Prop({ required: true })
  amountDue: number;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: String, enum: ['unpaid', 'paid'], default: 'unpaid' })
  status: string;

  @Prop({ type: Date })
  lastReminderSent?: Date;
}

export const DebtSchema = SchemaFactory.createForClass(Debt);