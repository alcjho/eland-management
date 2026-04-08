import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TenantDto {
    @IsString()
    @IsNotEmpty()
    ownerId: string;

    @IsString()
    @IsNotEmpty()
    tenantUserId: string;

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    occupation: string;

    @IsString()
    @IsNotEmpty()
    maritalStatus: string;

    @IsString()
    @IsOptional()
    partnerName: string;

    @IsNumber()
    @IsOptional()
    numberOfKids: number;
    
    @IsString()
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    emergencyContact: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth: Date;

    @IsOptional()
    haveKids: boolean;

    @IsString()
    @IsNotEmpty()
    previousAddress: string;

    @IsString()
    @IsNotEmpty()
    refPhone: string;

    @IsString()
    @IsNotEmpty()
    emergencyContactPhone: string;
}