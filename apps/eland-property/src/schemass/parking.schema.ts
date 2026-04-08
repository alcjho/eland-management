import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LeaseLabel } from '../types/leaseLabel.type';

export type ParkingDocument = Parking & Document;

export enum ParkingStatus {
    RESERVED = 'reserved',
    OCCUPIED = 'occupied',
    AVAILABLE = 'available'
}

export enum VehicleType {
    CAR = 'car',
    MOTORCYCLE = 'motorcycle',
    TRUCK = 'truck',
    ANY = 'any',
    OTHER = 'other'
}

export enum ChargeFrequencies {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    HOURLY = 'hourly',
    MONTHLY = 'monthly'
}

@Schema({ timestamps: true })
export class Parking {
  @Prop({ required: true })
  userId: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Property', required: true })
  propertyId: string; // Reference to the Property that owns the 
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lodge', required: false })
  lodgeId?: string; 
  
  @Prop({ required: true })
  leaseLabel: string;

  @Prop({ required: true })
  slotNumber: string; // Unique identifier for the parking slot

  @Prop({ required: true, enum: ParkingStatus })
  status: ParkingStatus; // Current status of the parking slot

  @Prop({ required: true, enum: VehicleType })
  vehicleType: VehicleType; // Type of vehicle allowed

  @Prop({ default: 0 })
  charge: number; // Fee per hour for parking

  @Prop({ default: 0 })
  chargeFrequency: ChargeFrequencies; // Fee per hour for parking

  @Prop({ required: true, default: false })
  isAssigned: boolean

  @Prop({ required: true, default: false })
  isMainAsset: boolean;
}

export const ParkingSchema = SchemaFactory.createForClass(Parking);