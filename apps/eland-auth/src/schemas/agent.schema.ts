import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AgentDocument  = Agent & Document;

@Schema({ timestamps: true })
export class Agent {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    license_number: string

    @Prop({ required: false })
    assigned_properties: string 
}

export const AgentSchema = SchemaFactory.createForClass(Agent);