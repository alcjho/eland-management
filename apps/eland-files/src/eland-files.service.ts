import { Injectable, Inject, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { STORAGE_SERVICE_TOKEN, IStorageService } from './interfaces/storage.interface';
import { ProtectedDocument } from './entities/protected-document.entity';
import { Album, AlbumCategory } from './entities/album.entity';
import { join } from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { UploadOptions } from './interfaces/upload-options.interface';
import { createReadStream, ReadStream } from 'fs';

@Injectable()
export class ElandFilesService {
  private readonly logger = new Logger(ElandFilesService.name);

  constructor(
    @InjectRepository(ProtectedDocument)
    private readonly protectedRepo: Repository<ProtectedDocument>,
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
    @Inject(STORAGE_SERVICE_TOKEN) 
    private readonly storageService: IStorageService,
    private readonly configService: ConfigService
  ) {}

  // eland-files.service.ts
  async uploadFileToAlbum(file: Express.Multer.File, ownerId: string, options: UploadOptions) {
      const album = await this.albumRepo.findOne({ where: { id: options.albumId } });
      if (!album) throw new NotFoundException('Album not found');

      if (!file.mimetype.startsWith('image/')) {
          throw new BadRequestException('Only images allowed in albums');
      }

      // Generate a unique filename if Multer didn't provide one (for Memory Storage)
      if (!file.filename) {
          const crypto = require('crypto');
          const extension = file.originalname.split('.').pop();
          const randomId = crypto.randomBytes(16).toString('hex');
          file.filename = `${randomId}.${extension}`;
      }

      // 1. Save physical file/metadata via storage service
      const storageDetails = await this.storageService.saveProtectedFile(
          file, 
          ownerId, 
          options
      );

      // 2. Create Postgres record
      // FIX: Use storageDetails.filename instead of file.filename.split
      const newDoc = this.protectedRepo.create({
          ownerId,
          path: storageDetails.path,
          filename: storageDetails.filename,
          originalName: storageDetails.originalName,
          mimeType: storageDetails.mimetype,
          album: album,
      });

      return await this.protectedRepo.save(newDoc);
  }

  // eland-files.service.ts
  async uploadMedia(file: Express.Multer.File, ownerId: string, options: UploadOptions) {

      if (!file.mimetype.startsWith('image/')) {
          throw new BadRequestException('Not an image file - only media uploads allowed');
      }

      // Generate a unique filename if Multer didn't provide one (for Memory Storage)
      if (!file.filename) {
          const crypto = require('crypto');
          const extension = file.originalname.split('.').pop();
          const randomId = crypto.randomBytes(16).toString('hex');
          file.filename = `${randomId}.${extension}`;
      }

      // 1. Save physical file/metadata via storage service
      const storageDetails = await this.storageService.saveProtectedFile(
          file,
          ownerId,
          options
      );

      // 2. Create Postgres record
      // FIX: Use storageDetails.filename instead of file.filename.split
      console.log("Storage details returned from service:", storageDetails);
      
      const media = this.protectedRepo.create({
          ownerId,
          path: storageDetails.path,
          filename: storageDetails.filename,
          originalName: storageDetails.originalName,
          mimeType: storageDetails.mimetype,
          album: null,
      });

      return { data: await this.protectedRepo.save(media) };
  }

  /**
   * Generates a readable stream for a protected file
   * @param fileId The UUID of the ProtectedDocument
   */
  async getFileStream(fileId: string): Promise<{ stream: ReadStream; mimeType: string; fileName: string }> {
    // 1. Find the document record in the database
    const doc = await this.protectedRepo.findOne({ where: { id: fileId } });
    
    if (!doc) {
      throw new NotFoundException('File record not found in database');
    }

    // 2. Resolve the absolute path
    const root = this.configService.get<string>('PROTECTED_DOCUMENT_ROOT');
    const absoluteFilePath = join(root, doc.path);

    // 3. Verify the file actually exists on the filesystem
    try {
      await fs.access(absoluteFilePath);
    } catch (err) {
      this.logger.error(`Physical file missing at: ${absoluteFilePath}`);
      throw new NotFoundException('File content missing on storage');
    }

    return {
      stream: createReadStream(absoluteFilePath),
      mimeType: doc.mimeType,
      fileName: doc.originalName,
    };
  }

  /**
   * Fetches multiple files and converts them to base64
   */
  async getMediaBatch(fileIds: string[]): Promise<any[]> {
    const protectedRoot = this.configService.get<string>('PROTECTED_DOCUMENT_ROOT');
    
    // Using TypeORM IN operator instead of Mongoose $in
    const docs = await this.protectedRepo.createQueryBuilder('doc')
      .where("doc.id IN (:...ids)", { ids: fileIds })
      .getMany();

    const batchPromises = docs.map(async (doc) => {
      const absoluteFilePath = join(protectedRoot, doc.path);
      try {
        const buffer = await fs.readFile(absoluteFilePath);
        return {
          fileId: doc.id,
          mimetype: doc.mimeType,
          originalName: doc.originalName,
          base64: buffer.toString('base64'),
        };
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.logger.warn(`File missing at: ${absoluteFilePath}`);
          return null;
        }
        throw new InternalServerErrorException(`Processing failed for ${doc.id}`);
      }
    });

    const results = await Promise.all(batchPromises);
    return results.filter(Boolean);
  }

  // eland-files.service.ts

  async createAlbum(data: { 
    name: string; 
    resourceId: string; 
    resourceType: string; 
    userId: string;
    category?: AlbumCategory;
    description?: string;
  }): Promise<Album> {
    // Create the entity instance
    const newAlbum = this.albumRepo.create({
      album_name: data.name,
      resourceId: data.resourceId,
      resourceType: data.resourceType,
      userId: data.userId,
      album_category: data.category || AlbumCategory.OTHER,
      description: data.description,
      active: true,
    });

    // Save to PostgreSQL
    try {
      return await this.albumRepo.save(newAlbum);
    } catch (error) {
      this.logger.error(`Failed to create album: ${error.message}`);
      throw new InternalServerErrorException('Could not create album record');
    }
  }
}