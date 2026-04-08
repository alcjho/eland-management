import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LeaseLabel } from '../types/leaseLabel.type';

export type PossessionDocument = Possession & Document;
enum Condition {
  NEW="new",
  GOOD="good",
  TOREPAIR="to be repaired"
}

enum PossessionCategory {
  FURNITURE="Furniture",
  APPLIANCE="Appliance",
  ELECTRONICS="Electronics",
  OTHER="other"
}

@Schema({ timestamps: true })
export class Possession {
  @Prop({ required: true})
  userId: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Property', required: true })
  propertyId: string; // Reference to the Property that owns the Possession

  @Prop({ required: false})
  lodgeId?: string;

  @Prop({ required: true })
  name: string; // e.g., "Sofa", "Bed", "Dining Table"

  @Prop({ required: true, type: String, enum: LeaseLabel, default: LeaseLabel.POSSESSION })
  leaseLabel: string;

  @Prop({ required: true,  enum: PossessionCategory})
  category: PossessionCategory; // e.g., "Furniture", "Appliance", "Electronics"

  @Prop({ required: true, default: "good", enum: Condition })
  condition: Condition; // e.g., "new", "good", "needs repair"

  @Prop()
  description?: string; // Optional additional details

  @Prop()
  value?: number; // Optional additional details

  @Prop({ required: true, default: false})
  isAssigned: boolean

  @Prop({ required: true, default: false })
  isMainAsset: boolean;
}

export const PossessionSchema = SchemaFactory.createForClass(Possession);