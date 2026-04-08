import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema} from 'mongoose';

export type AmenityDocument = Amenity & Document;

@Schema({ timestamps: true })
export class Amenity {
  @Prop({ required: true})
  userId: string
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Property', required: true })
  propertyId: string; // Reference to the Property that owns the Amenity

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: false })
  isMainAsset: boolean;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop([{ type: String }]) 
  features?: string[]; // List of extra details (e.g., ['Heated Pool', 'Fast WiFi'])

  @Prop({ required: false})
  extra_cost?: Number

  @Prop({ required: true, default: false})
  isPrivate: boolean

}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
