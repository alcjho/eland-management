import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type LogDocument  = Log & Document;
export enum Actions {
    login,
    logout,
    reset
}
export class Log {
    @Prop({ required: true })
    user: User

    @Prop({ required: true })
    action: string

    @Prop({ required: true, default: Date.now })
    timestamp: Date

    @Prop({ required: false })
    ip: string 
}