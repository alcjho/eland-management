// src/documents/storage/storage.interface.ts
import { ConfigService } from '@nestjs/config';
import { UploadOptions } from './upload-options.interface';


export const STORAGE_SERVICE_TOKEN = 'I_STORAGE_SERVICE';

export interface IStorageService {
  getMulterStorageEngine(): any;
  configService: ConfigService;

  // Added/Updated to match your requested call signature
  saveProtectedFile(
    file: Express.Multer.File, 
    ownerId: string, 
    options: UploadOptions,
  ): Promise<any>;

  deleteFile(path: string): Promise<boolean>;
}