// src/documents/storage/local-storage.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from './interfaces/storage.interface';
import { diskStorage } from 'multer';
import { unlink } from 'fs/promises';
import * as fs from 'fs';
import { extname, join } from 'path';
import { UploadOptions } from './interfaces/upload-options.interface';


@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly logger = new Logger(LocalStorageService.name);

  // Requirement: interface defines configService as a public property
  constructor(public readonly configService: ConfigService) {}

  // files are initially stored in a temporary directory; the actual location
  private multerStorage = diskStorage({
    destination: (req, file, cb) => {
      const DOCUMENT_ROOT = this.configService.get<string>('PROTECTED_DOCUMENT_ROOT');
      const tmpDir = join(DOCUMENT_ROOT, 'tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      cb(null, tmpDir);
    },
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => (Math.round(Math.random() * 16)).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  });

  async saveProtectedFile(file: Express.Multer.File,  ownerId: string, options: UploadOptions): Promise<any> {
    // Validate required parameters
    if (!ownerId || !options.asset || !options.doctype) {
      throw new BadRequestException('Missing required parameters: ownerId, asset, or doctype');
    }

    // Fallback for filename if it doesn't exist on the file object
    let fileName = file.filename || file.originalname;

    // If a name prefix is provided, prepend it to the filename
    if (options.name && options.name.trim().length > 0) {
      // Sanitize the name: keep alphanumeric, spaces, and hyphens; replace spaces with underscores
      const sanitizedName = options.name
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, '')  // Remove unsafe characters
        .replace(/\s+/g, '_');             // Replace whitespace with underscores
      
      // Extract the file extension from the original filename
      const fileExt = extname(fileName);
      const nameWithoutExt = fileName.slice(0, -fileExt.length);
      
      // Combine sanitized name + original filename (without extension) + extension
      fileName = `${sanitizedName}_${nameWithoutExt}${fileExt}`;
    }

    const DOCUMENT_ROOT = this.configService.get<string>('PROTECTED_DOCUMENT_ROOT');
    if (!DOCUMENT_ROOT) {
      throw new BadRequestException('PROTECTED_DOCUMENT_ROOT not configured');
    }

    let finalDir = join(
      DOCUMENT_ROOT, 
      ownerId, 
      'properties', 
      options.entityId, 
      options.asset? options.asset + '/' : '', 
      options.assetId? options.assetId + '/' : '', 
      options.doctype? options.doctype + '/' : ''
    );

    let finalPath = join(finalDir, fileName);
    const pathSegments = [
      ownerId,
      'properties',
      options.entityId,
      options.asset,
      options.assetId,
      options.doctype,
      fileName
    ];
    
    let normalizedPath = pathSegments.filter(Boolean).join('/'); // Join non-empty segments with forward slashes
    
    if(options.asset === 'properties') {
      finalDir = join(DOCUMENT_ROOT, ownerId, 'properties', options.entityId, options.doctype);
      finalPath = join(finalDir, fileName);
      normalizedPath = `${ownerId}/properties/${options.entityId}/${options.doctype}/${fileName}`;
    }
    
    
    // ensure destination exists
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // move file from temp to final location
    try {
      if (file.path && file.path !== finalPath) {
        await fs.promises.rename(file.path, finalPath);
      }
    } catch (e) {
      this.logger.error(`Error moving file to final destination: ${e.message}`);
      throw new BadRequestException('Failed to save file');
    }

    return {
        path: normalizedPath,
        filename: fileName,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        fileType: options?.doctype
    };
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      const root = this.configService.get<string>('PROTECTED_DOCUMENT_ROOT');
      // Convert stored path (forward slashes) back to OS-specific separator
      const pathSegments = path.split('/');
      const osSpecificPath = join(...pathSegments);
      await unlink(join(root, osSpecificPath));
      return true;
    } catch (e) {
      this.logger.error(`Error deleting file: ${e.message}`);
      return false;
    }
  }
  
  getMulterStorageEngine() {
    return this.multerStorage;
  }
}