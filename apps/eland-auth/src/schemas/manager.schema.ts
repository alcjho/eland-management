import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type ManagerDocument  = Manager & Document;

@Schema({ timestamps: true })
export class Manager {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    ownerId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, unique: true, type: MongooseSchema.Types.ObjectId })
    managerUserId: MongooseSchema.Types.ObjectId;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId})
    locationId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    fullname: string

    @Prop({ required: true, enum: ['M', 'F', 'O'] })
    gender: string

    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    workingStatus: string

    @Prop({ required: true })
    startDate: Date
    
    @Prop({ required: true })
    refPhone: string

    @Prop({ required: false })
    assignedProperties: string[]
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);