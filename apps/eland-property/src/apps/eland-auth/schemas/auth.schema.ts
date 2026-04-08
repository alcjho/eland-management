import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type AuthDocument = Auth & Document
export enum Hash {
    sha256="sha256",
    md5="md5"
}

@Schema({ timestamps: true })
export class Auth {
    @Prop({ required: true, unique: true})
    user: User
    
    @Prop({ required: true })
    hashed_password: string

    @Prop({ required: true, default: Hash.sha256})
    hashed_algo: string

    @Prop({ required: false })
    last_login: Date

    @Prop({ required: true, default: false})
    two_factor_enabled: boolean

    @Prop({ required: false })
    password_reset_token: string
}

export const AuthSchema = SchemaFactory.createForClass(Auth)