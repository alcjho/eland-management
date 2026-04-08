import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LeaseLabel } from '../types/leaseLabel.type';
import { BedroomType } from '../types/bedroom-type.type';

export type BedroomDocument = Bedroom & Document;

@Schema({ timestamps: true })
export class Bedroom {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  tenantUserId?: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Lodge"})
  lodgeId?: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true, enum: BedroomType})
  type: string;

  @Prop({ required: true, type: String, enum: LeaseLabel, default: LeaseLabel.BEDROOM })
  leaseLabel: string;

  @Prop({ required: true })
  description?: string;

  @Prop({ required: true, default: true })
  isMainAsset: boolean;
}

export const BedroomSchema = SchemaFactory.createForClass(Bedroom);