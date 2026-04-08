import { 
    Controller, Body, Post, Param, UseGuards, 
    UseInterceptors, UploadedFile, Inject, 
    BadRequestException, Logger, 
    Req,
    Get,
    Res
} from '@nestjs/common';
import { ElandFilesService } from './eland-files.service';
import { JwtAuthGuard } from './guards/jwt.guard'; // Ensure this handles your JWT
import { IStorageService, STORAGE_SERVICE_TOKEN } from './interfaces/storage.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { LocalStorageService } from './local-storage.service';
import { UploadOptions } from './interfaces/upload-options.interface';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';

@Controller('files')
export class ElandFilesController {
    private readonly logger = new Logger(ElandFilesController.name);

    constructor(
        private readonly documentsService: ElandFilesService,
        @Inject(STORAGE_SERVICE_TOKEN) private readonly storageService: IStorageService,
        private readonly configService: ConfigService, 
    ) {}

    /**
     * Upload a picture to a specific album.
     * Request includes: albumId in params, file in body.
     */
    @Post('album/:albumId/upload')
    @UseGuards(JwtAuthGuard)
    // Uses the Multer engine from LocalStorageService to handle file uploads directly to disk with proper destination logic
    @UseInterceptors(FileInterceptor('file', 
        { 
            storage: new LocalStorageService(new ConfigService()).getMulterStorageEngine(),
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit, adjust as needed
        })
    ) 
    async uploadToAlbum(
        
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UploadOptions, // Typically extracted from JWT req.user in production
        @Req() req: any
    ) {
        console.log("file", file);
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const { ownerId } = req.user;

        // The service now handles the Postgres logic and relationship
        return this.documentsService.uploadFileToAlbum(file, ownerId, body);
    }

    @Post('media/upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', 
        { 
            storage: new LocalStorageService(new ConfigService()).getMulterStorageEngine(),
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit, adjust as needed
        })
    )
    async uploadMedia(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UploadOptions, // e.g. 'property', 'lodge', etc.
        @Req() req: any
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        
       const { ownerId } = req.user;
        // The service now handles the Postgres logic and relationship
        return this.documentsService.uploadMedia(file, ownerId, body);
    }


    @Get('media/download/:id')
    async downloadFile(
        @Param('id') id: string, 
        @Res({ passthrough: true }) res: Response
    ) {
        const fileData = await this.documentsService.getFileStream(id);

        // Set headers so the browser knows how to handle the data
        res.set({
            'Content-Type': fileData.mimeType,
            'Content-Disposition': `inline; filename="${fileData.fileName}"`,
        });

        return new StreamableFile(fileData.stream);
    }
    


    /**
     * Get a batch of media as base64 strings for the frontend gallery.
     * Replaces the old Mongoose batch-by-entity logic.
     */
    @Post('media/batch')
    @UseGuards(JwtAuthGuard)
    async getMediaBatch(@Body('fileIds') fileIds: string[]) {
        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            return [];
        }
        
        return this.documentsService.getMediaBatch(fileIds);
    }

    /**
     * Create a new Album for a Monolith asset (Lodge, Parking, etc.)
     */
    @Post('album')
    @UseGuards(JwtAuthGuard)
    async createAlbum(
        @Body() data: { 
            name: string, 
            resourceId: string, 
            resourceType: string, 
            userId: string,
            category?: any 
        }
    ) {
        // You'll need to add a simple create method in ElandFilesService 
        // using your albumRepo.create(data) and albumRepo.save()
        return this.documentsService.createAlbum(data);
    }
}