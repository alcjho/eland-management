import { Document, Schema as MongooseSchema } from 'mongoose';

export interface MediaBatchResponse {
  fileId: unknown;
  entityId: MongooseSchema.Types.ObjectId,
  mimetype: string;
  originalName: string;
  base64: string;
}