import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BilanDocument = Bilan & Document;

@Schema({ timestamps: true })
export class Bilan {
  @Prop({ required: true })
  propertyId: string;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop({ required: true })
  totalDebts: number;

  @Prop({ required: true })
  totalExpenses: number;

  @Prop({ required: true })
  netProfit: number;

  @Prop({ type: Date, default: Date.now })
  generatedAt: Date;
}

export const BilanSchema = SchemaFactory.createForClass(Bilan);