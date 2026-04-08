import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    routes: []
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);