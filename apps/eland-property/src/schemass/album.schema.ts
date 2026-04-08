import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AssetType } from '../types/asset-type.type';

export type AlbumDocument = Album & Document;

enum AlbumCategory {
  INTERIOR = 'interior',
  EXTERIOR = 'exterior',
  FLOOR_PLAN = 'floor plan',
  OTHER = 'other'
}

const MAX_FILE_IDS = 50;

@Schema({ timestamps: true })
export class Album {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true, type: MongooseSchema.Types.ObjectId, ref: 'lodge'})
  lodgeId: MongooseSchema.Types.ObjectId;
 
  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length <= MAX_FILE_IDS,
      message: () => `files exceeds the limit of ${MAX_FILE_IDS}`
    }
  })
  fileIds: string[];

  @Prop({ required: true })
  album_name: string;

  @Prop({ required: true, enum: AlbumCategory})
  album_category: string;

  description?: string;

  @Prop({ default: 'Property', enum: AssetType})
  asset: string;

  @Prop({ required: true, default: true})
  active: boolean;
}


const AlbumSchema = SchemaFactory.createForClass(Album);
export { AlbumSchema }