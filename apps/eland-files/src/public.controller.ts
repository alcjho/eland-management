import { Controller, Body, Get, Post, Param, Res, UseGuards, NotFoundException, InternalServerErrorException, UseInterceptors, UploadedFile, Req, Inject, BadRequestException, HttpStatus, HttpCode } from '@nestjs/common';
import { ElandFilesService } from './eland-files.service';
import { IStorageService, STORAGE_SERVICE_TOKEN } from './interfaces/storage.interface';
import { DynamicFileInterceptor } from './interceptors/dynamic-file.interceptor';
import { UploadPublicMetadataDto } from './dtos/upload-metadata.dto';
import { getRouteSegment } from './utilities/fileStreamSegments';
import { ConfigService } from '@nestjs/config';

export enum UploadType {
    Documents = 'documents',
    Media = 'media',
    Other = 'other',
}

@Controller('public-asset')
export class PublicController {
    constructor(
        private readonly documentsService: ElandFilesService,
        @Inject(STORAGE_SERVICE_TOKEN) private readonly storageService: IStorageService,
        private readonly configService: ConfigService, 
    ) {}

    /**
     * 
     * @param fileId 
     * @param body 
     * @param file 
     * @param req 
     * @returns 
     */
    @Post('media/upload/:fileId')
    @UseInterceptors(DynamicFileInterceptor('file'))
    async uploadMedia(
        @Param('fileId') fileId: string,
        @Body() body: UploadPublicMetadataDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request 
    ): Promise<any> {
        
        if (!file) {
            throw new BadRequestException('File is missing from the request.');
        }
        
        // get required segments from route (<entity>/<doctype>/<action>)
        const entity = getRouteSegment(req.url).entity;
        const doctype = getRouteSegment(req.url).doctype;
        
        return this.handleFileUpload(file, fileId, entity, doctype)
    }

    /**
     * 
     * @param file 
     * @param fileId 
     * @param entity 
     * @param doctype 
     * @returns 
     */
    private async handleFileUpload(
        file: Express.Multer.File, 
        fileId: string,
        entity: string,
        doctype: string
    ) {
        if (!file) { throw new BadRequestException('File is missing from the request.'); }
    
        // Call service, passing the upload type for storage path
        // const documentAsset = await this.documentsService.createPublicDocument(
        //     file,
        //     fileId,
        //     entity, 
        //     doctype
        // );
        
        return {
            status: 201, 
            data: {}
        }
    }
}