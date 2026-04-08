import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Amenity } from './amenity.schema';
import { Room } from './room.schema';
import { Parking } from './parking.schema';
import { Possession } from './possession.schema';
import { LeaseLabel } from '../types/leaseLabel.type';
import { Bedroom } from './bedroom.schema';
import { CurrencyType } from '../types/currency.type';
import { LodgeStatus } from '../types/lodge-status.type';

export type LodgeDocument = Lodge & Document;
export enum leaseType {
    monthly="monthly",
    yearly="yearly",
    short="short"
}

@Schema({ timestamps: true })
export class Lodge {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Property'})
  propertyId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  tenantUserId?: string

  @Prop({ required: false })
  coverImageId: string
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true})
  lodgeNumber: string

  @Prop({ required: true })
  floorNumber: string

  @Prop()
  description?: string;

  @Prop({ required: true, default: true })
  isMainAsset: boolean;

  @Prop({ required: true, enum: LodgeStatus, default: 'available' })
  status: string;

  @Prop({ required: true })
  price: Number

  @Prop({ required: true, enum: CurrencyType, default: 'USD' })
  currency: string

  @Prop({ required: true, enum: leaseType })
  leaseType: String

  @Prop({ required: true, type: String, enum: LeaseLabel, default: LeaseLabel.LODGE })
  leaseLabel: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Amenity' }]) 
  amenities?: Amenity[]

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'BedRoom' }])
  bedrooms?: Bedroom[]

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Room' }])
  rooms?: Room[]

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Parking' }])
  parkings?: Parking[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Possession' }])
  possessions?: Possession[];
}

const LodgeSchema = SchemaFactory.createForClass(Lodge);
LodgeSchema.index({ tenantUserId: 1 },
  { unique: true, partialFilterExpression: { tenantUserId: { $exists: true, $ne: null } } }
);

export { LodgeSchema }