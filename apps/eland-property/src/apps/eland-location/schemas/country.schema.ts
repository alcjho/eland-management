import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export  type CountryDocument = Country & Document;

@Schema({ timestamps: true })
export class Country {

  @Prop({ required: true, type: Object })
  name: {fr: string, en: string};

  @Prop()
  code?: string; // e.g., "US" for United States
}

export const CountrySchema = SchemaFactory.createForClass(Country);
