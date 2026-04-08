import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type OwnerDocument  = Owner & Document;

@Schema({ timestamps: true })
export class Owner {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    mainOwnerId: MongooseSchema.Types.ObjectId;

    @Prop({ required: false })
    ownerIdToken: string;

    @Prop({ required: true, default: false})
    isMainOwner: boolean

    @Prop({ required: true, unique: true, type: MongooseSchema.Types.ObjectId })
    ownerUserId: MongooseSchema.Types.ObjectId;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId})
    locationId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    fullname: string

    @Prop({ required: false, enum: ['M', 'F', 'O'] })
    gender: string

    @Prop({ required: false })
    title: string

    @Prop({ required: false })
    startDate: Date

    @Prop({ required: false, default: 10 })
    sharePct: number

    @Prop({ required: false })
    onProperties: string[]
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);