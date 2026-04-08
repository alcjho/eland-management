import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document

@Schema({ timestamps: true })
export class Province {

  @Prop({ required: true, type: Object })
  name: { fr: string, en: string }

  @Prop({ required: true })
  code: string
}
export const ProvinceSchema = SchemaFactory.createForClass(Province);
