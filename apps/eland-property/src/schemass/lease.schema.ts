import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { LeaseLabel } from "../types/leaseLabel.type";

export type LeaseDocument = Lease & Document;

@Schema({ timestamps: true })
export class Lease {
  @Prop({ required: true, unique: true }) // Link to User model
  userId: string;

  @Prop({ required: true, unique: true, type: MongooseSchema.Types.ObjectId, ref: 'Property' })
  propertyId: MongooseSchema.Types.ObjectId; // Top-level property reference

  // Main lease asset (must be Lodge, Suite, or Facility)
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, refPath: 'leaseLabel' })
  leaseItemId: MongooseSchema.Types.ObjectId;

  // Lease label validation: Ensures leaseLabel matches the correct main asset
  @Prop({ 
    required: true, 
    type: String, 
    enum: LeaseLabel,
    validate: {
      validator: function (value: string) {
        const validLeaseAssets = ['Lodge', 'Property', 'BedRoom'];
        return validLeaseAssets.includes(value); // LeaseLabel must match an allowed main asset
      },
      message: props => `${props.value} is not a valid main asset for a lease.`,
    }
  })
  leaseLabel: string;

  // Additional assets linked to the lease (optional)
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Room' }])
  additionalRooms: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Parking' }])
  additionalParkings: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Amenity' }])
  additionalAmenities: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Possession' }])
  additionalPossessions: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true, type: Date })
  leaseStartDate: Date;

  @Prop({ required: true, type: Date })
  leaseEndDate: Date;

  @Prop({ required: true, type: String, enum: ['Monthly', 'Yearly', 'Bi-Weekly', 'Quarterly'] })
  paymentCycle: string;

  @Prop({ required: true, type: Number })
  payment: number;

  @Prop([{ type: Number }]) // Extra/cumulative costs beyond base rent
  extraCosts: number[];

  @Prop({ required: false, type: Number, default: 0 })
  securityDeposit: number;

  @Prop({ required: false, type: String })
  leaseTermsPDF: string; // Legal terms document path

  @Prop({ required: true, type: Number })
  numberOfOccupants: number;

  @Prop({ type: Boolean, default: false })
  isCurrent: boolean;

  @Prop({ type: String, enum: ['active', 'pending', 'ended', 'cancelled', 'expired', 'renewed'], default: 'pending' })
  leaseStatus: string;

  @Prop({ required: false, type: String })
  leaseNote: string;

  // Lease access control (modifiable only by owner and associates)
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  ownerAssociates: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, type: String, enum: ['read-only', 'editable'], default: 'read-only' })
  tenantAccess: string; // Once signed, tenants have read-only access

  // Prevent overlapping lease periods for the same tenant within the same property
  @Prop({ unique: true, sparse: true })
  leaseIdentifier: string; // Format: `${userId}_${propertyId}_${leaseStartDate}`

  @Prop({ required: false })
  warrantorName: string

  @Prop({ required: false })
  warrantorPhone: string

  @Prop({ required: false })
  warrantorEmail: string

  @Prop({ required: false })
  warrantorOccupation: string

  @Prop({ required: false })
  warrantorAddress: string
}

export const LeaseSchema = SchemaFactory.createForClass(Lease);