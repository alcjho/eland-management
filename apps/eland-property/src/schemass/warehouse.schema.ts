import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Amenity } from './amenity.schema';
import { Room } from './room.schema';
import { Parking } from './parking.schema';
import { Possession } from './possession.schema';
import { LeaseLabel } from '../types/leaseLabel.type';

export type WarehouseDocument = Warehouse & Document;
export enum leaseType {
    monthly="monthly",
    yearly="yearly",
    short="short"
}

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ required: true, unique: true })
  userId: string

  @Prop({ required: true, unique: true, type: MongooseSchema.Types.ObjectId, ref: 'Property'})
  propertyId: string;

  @Prop({ required: false, unique: true })
  tenantUserId: string

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  size: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: true })
  isMainAsset: boolean;

  @Prop({ required: true })
  status: string

  @Prop({ required: true })
  price: Number

  @Prop({ required: true, enum: leaseType })
  leaseType: String

  @Prop({ required: true, type: String, enum: LeaseLabel, default: LeaseLabel.WAREHOUSE })
  leaseLabel: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Amenity' }]) 
  amenities: Amenity[]

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Room' }])
  rooms?: Room[]

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Parking' }])
  parkings: Parking[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Possession' }])
  possessions: Possession[];
}


const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
export { WarehouseSchema }