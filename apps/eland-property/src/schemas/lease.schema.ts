import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { LeaseLabel } from "../types/leaseLabel.type";

export type LeaseDocument = Lease & Document;

@Schema({ timestamps: true })
export class Lease {
  @Prop({ required: true }) // Link to User model
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Property' })
  propertyId: MongooseSchema.Types.ObjectId; // Link to the top-level property

  // Polymorphic reference: leaseItemId refers to the actual leased unit (Property, Lodge, or Room)
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, refPath: 'leaseLabel' })
  leaseItemId: MongooseSchema.Types.ObjectId;

  // Crucial for refPath - must match the model names used in MongooseModule.forFeature()
  @Prop({ required: true, type: String, enum: LeaseLabel })
  leaseLabel: string;

  @Prop({ required: true, type: Date })
  leaseStartDate: Date;

  @Prop({ required: true, type: Date })
  leaseEndDate: Date;

  @Prop({ required: true, type: String, enum: ['Monthly', 'Yearly', 'Bi-Weekly', 'Quarterly'] }) // Added more cycles
  paymentCycle: string;

  @Prop({ required: true, type: Number })
  payment: number; // The rent amount per paymentCycle

  @Prop({ required: false, type: Number, default: 0 })
  securityDeposit: number;

  @Prop({ required: false, type: String })
  leaseTerms: string; // Path/URL to the legal document attached to the lease.

  @Prop({ required: true, type: Number }) // Renamed for clarity if it's the count
  numberOfOccupants: number;

  @Prop({ type: Boolean, default: false })
  isCurrent: boolean; // Indicates if this is the currently active lease for leaseItemId

  @Prop({ type: String, enum: ['active', 'pending', 'ended', 'cancelled', 'expired', 'renewed'], default: 'pending' }) // Added more statuses and a default
  leaseStatus: string;

  @Prop({ required: false, type: String })
  leaseNote: string; // Internal notes about the lease

  // References to Amenities
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Amenity' }])
  sharedAmenities: MongooseSchema.Types.ObjectId[]; // Amenities available to all residents of the building/property

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Amenity' }])
  privateAmenities: MongooseSchema.Types.ObjectId[]; // Amenities exclusive to this leaseItemId

  // References to Rooms (e.g., shared kitchen, living room, bathroom within a multi-room lease)
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Room' }])
  sharedRooms: MongooseSchema.Types.ObjectId[];

  // References to Possessions (e.g., appliances, furniture)
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Possession' }])
  sharedPossessions: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Possession' }])
  privatePossessions: MongooseSchema.Types.ObjectId[];

  // References to Parking spots
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Parking' }])
  privateParkings: MongooseSchema.Types.ObjectId[]; // Assuming individual parking spots
}

export const LeaseSchema = SchemaFactory.createForClass(Lease);