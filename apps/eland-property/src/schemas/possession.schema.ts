import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LeaseLabel } from '../types/leaseLabel.type';

export type PossessionDocument = Possession & Document;
enum Condition {
  NEW="new",
  GOOD="good",
  TOREPAIR="to be repaired"
}

enum Category {
  FURNITURE="Furniture",
  APPLIANCE="Appliance",
  ELECTRONICS="Electronics",
  OTHER="other"
}

@Schema({ timestamps: true })
export class Possession {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Property', required: true })
  propertyId: string; // Reference to the Property that owns the Possession

  @Prop({ required: true })
  name: string; // e.g., "Sofa", "Bed", "Dining Table"

  @Prop({ required: true, type: String, enum: LeaseLabel, default: LeaseLabel.POSSESSION })
  leaseLabel: string;

  @Prop({ required: true,  enum: Category})
  category: string; // e.g., "Furniture", "Appliance", "Electronics"

  @Prop({ required: true, default: "good", enum: Condition })
  condition: string; // e.g., "new", "good", "needs repair"

  @Prop()
  description?: string; // Optional additional details

  @Prop()
  value?: number; // Optional additional details

  @Prop({ required: true, default: false})
  isAssigned: boolean

}

export const PossessionSchema = SchemaFactory.createForClass(Possession);