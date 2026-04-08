import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocationDocument = Location & Document;
export enum PropertyType {
    RESIDENTIAL = 'residential',
    COMMERCIAL = 'commercial',
    INDUSTRIAL = 'industrial'
}

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true, enum: PropertyType })
  property_type: string

  @Prop()
  building_name?: string

  @Prop({ required: true })
  street_no: string;

  @Prop({ required: true })
  street_name: string;

  @Prop()
  apt_no?: string;

  @Prop()
  suite_no?: string;

  @Prop()
  lot_no?: string;

  @Prop()
  unit_no?: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true })
  city: Types.ObjectId; // Reference to City schema

  @Prop({ type: Types.ObjectId, ref: 'Province', required: true })
  province: Types.ObjectId; // Reference to Province schema

  @Prop({ type: Types.ObjectId, ref: 'Country', required: true })
  country: Types.ObjectId; // Reference to Country schema

  @Prop({ required: true })
  zipcode: string;

  @Prop()
  pobox?: string
}

export const LocationSchema = SchemaFactory.createForClass(Location);