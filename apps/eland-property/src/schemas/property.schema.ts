import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Room } from './room.schema';
import { Amenity } from './amenity.schema';
import { Possession } from './possession.schema';
import { Lodge } from './lodge.schema';
import { Parking } from './parking.schema';
import { LeaseLabel } from '../types/leaseLabel.type';

export type PropertyDocument = Property & Document;

export enum PropertyStatus {
    UNDER_CONSTRUCTION = 'Under construction',
    VACANT='Vacant',
    READY='Ready',
    OCCUPIED='Occupied',
    FOR_SALE='For sale',
    MAINTENANCE='Maintenance',
    RESTRICTED='Restricted'
}

export enum PropertyType {
    RESIDENTIAL = 'residential',
    COMMERCIAL = 'commercial',
    INDUSTRIAL = 'industrial'
}

@Schema({ timestamps: true })
export class Property {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: PropertyType })
  type: string;

  @Prop({ required: true, type: String, enum: LeaseLabel, default: LeaseLabel.PROPERTY })
  leaseLabel: string;

  @Prop()
  locationId?: string; // Reference to Location Microservice

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string; // Reference to Auth Microservice

  @Prop({ required: true, enum: PropertyStatus })
  status: PropertyStatus;

  @Prop({ default: 0 })
  totalUnits: number; // Number of lodges

  @Prop({ default: false })
  isSold: boolean;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Lodge' }])
  lodges: Lodge[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Parking' }])
  parkings: Parking[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Amenity' }])
  amenities: Amenity[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Possession' }])
  possessions: Possession[];
}

const PropertySchema = SchemaFactory.createForClass(Property);

export { PropertySchema }