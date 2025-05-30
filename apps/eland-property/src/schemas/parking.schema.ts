import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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

@Schema({ timestamps: true })
export class Parking {

  @Prop({ required: true })
  slotNumber: string; // Unique identifier for the parking slot

  @Prop({ required: true, enum: ParkingStatus })
  status: ParkingStatus; // Current status of the parking slot

  @Prop({ required: true, enum: VehicleType })
  vehicleType: VehicleType; // Type of vehicle allowed

  @Prop({ default: 0 })
  chargePerHour: number; // Fee per hour for parking

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Property', required: true })
  propertyId: string; // Reference to the Property that owns the parking

  @Prop({ required: true, default: false })
  isAssigned: boolean
}

export const ParkingSchema = SchemaFactory.createForClass(Parking);