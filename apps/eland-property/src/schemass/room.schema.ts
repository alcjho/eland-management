import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LeaseLabel } from '../types/leaseLabel.type';

export enum roomType {
    LIVING="Living room",
    DINING="Dining room",
    KITCHEN="Kitchen",
    BATH="Bathroom",
    POWDER="Powder room",
    WASH="Wash room",
    WHAREHOUSE="Warehouse"
}

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Lodge"})
  lodgeId: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true, enum: roomType})
  type: string;

  @Prop({ required: true, type: String, enum: LeaseLabel, default: LeaseLabel.ROOM })
  leaseLabel: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: false })
  isMainAsset: boolean;
  
}

export const RoomSchema = SchemaFactory.createForClass(Room);