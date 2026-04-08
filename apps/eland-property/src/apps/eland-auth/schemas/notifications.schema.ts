import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type NotificationDocument = Notification & Document
export enum Status {
    read,
    unread
}
export class Notification {
    @Prop({ required: true, unique: true})
    user: User
    
    @Prop({ required: true })
    message: string

    @Prop({ required: true, default: Status.unread.toString})
    status: string

    @Prop({ required: false, default: Date.now})
    timestamp: Date
}