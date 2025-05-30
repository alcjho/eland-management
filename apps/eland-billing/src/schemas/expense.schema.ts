import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: String, enum: ['repair', 'renovation', 'replacement', 'legal', 'other'], required: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Date, default: Date.now })
  dateSpent: Date;

  @Prop({ type: String, required: false })
  propertyId?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);