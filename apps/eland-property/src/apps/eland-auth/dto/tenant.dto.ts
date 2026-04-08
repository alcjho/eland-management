import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
    previousAddress: string;

    @IsString()
    @IsNotEmpty()
    refPhone: string;

    @IsString()
    @IsNotEmpty()
    emergencyContactPhone: string;
}