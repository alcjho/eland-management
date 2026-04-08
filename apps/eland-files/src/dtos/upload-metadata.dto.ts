// src/documents/dto/upload-metadata.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class UploadProtectedMetadataDto {
    @IsString()
    entityId?: string;
    @IsNotEmpty()
    @IsString()
    entity: string;
    @IsNotEmpty()
    @IsString()
    doctype: string;
}

export class UploadPublicMetadataDto {
    @IsNotEmpty()
    @IsString()
    entity: string;
    @IsNotEmpty()
    @IsString()
    doctype: string;
}