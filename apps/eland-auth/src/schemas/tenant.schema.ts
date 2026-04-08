import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type TenantDocument  = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    ownerId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, unique: true, type: MongooseSchema.Types.ObjectId })
    tenantUserId: MongooseSchema.Types.ObjectId;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId})
    locationId: MongooseSchema.Types.ObjectId;
   
    @Prop({ required: true })
    fullname: string;
    
    @Prop({ required: true, enum: ['M', 'F', 'O'] })
    gender: string

    @Prop({ required: false, enum: ['Mr.', 'Mrs', 'Other'] })
    title: string;

    @Prop({ required: false, enum: ['Married', 'Divorced', 'Separated', 'Partner']})
    maritalStatus: string;

    @Prop({ required: false })
    partnerName: string;

    @Prop({ required: false })
    haveKids: boolean;

    @Prop({ required: false })
    numberOfkids: number;

    @Prop({ required: true })
    occupation: string;

    @Prop({ required: false })
    partnerOccupation: string;

    @Prop({ required: true })
    previousAddress: string;

    @Prop({ required: true })
    refPhone: string;

    @Prop({ required: false })
    refPhone1: string;

    @Prop({ required: false })
    refPhone2: string;

    @Prop({ required: true })
    emergencyContactPhone: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);