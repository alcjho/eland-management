import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CityDocument = City & Document;

@Schema({ timestamps: true })
export class City {
  @Prop({ required: true, type: Object})
  name: { fr: string, en: string }
}

export const CitySchema = SchemaFactory.createForClass(City);