import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument  = Role & Document;
export enum Permissions {
    read="read",
    write="write",
    delete="delete"
}

@Schema({ timestamps: true })
export class Role {
    @Prop({ required: false })
    _id?: string

    @Prop({ required: true })
    name: string

    @Prop({ required: true,  default: [Permissions.read] })
    permissions: []
}

export const RoleSchema = SchemaFactory.createForClass(Role);