import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// Fixed: Should be RoleDocument, not UserDocument
export type RoleDocument = Role & Document;

export enum Permissions {
    READ = "read",
    WRITE = "write",
    DELETE = "delete"
}

@Schema({ timestamps: true })
export class Role {
    @Prop({ required: true })
    name: string

    // Fixed: Proper array type definition with enum values
    @Prop({ 
        required: true, 
        type: [String], 
        enum: Object.values(Permissions),
        default: [Permissions.READ] 
    })
    permissions: Permissions[]
}

export const RoleSchema = SchemaFactory.createForClass(Role);