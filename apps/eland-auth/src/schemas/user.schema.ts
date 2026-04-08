  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { Document, Schema as MongooseSchema } from 'mongoose';
  import { Permissions, Role } from './role.schema';

  export type UserDocument = User & Document;

  @Schema({ timestamps: true })
  export class User {
    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, default: false })
    isActive: boolean

    @Prop({ required: false })
    activationToken: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: false }) // Reference Role
    role?: MongooseSchema.Types.ObjectId

    @Prop({ default : [Permissions.READ]})
    permissions: string[]
  }

export const UserSchema = SchemaFactory.createForClass(User);