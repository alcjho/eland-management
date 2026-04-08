import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OwnerDto {
    @IsString()
    @IsNotEmpty()
    mainOwnerId: string;

    @IsString()
    @IsNotEmpty()
    ownerUserId: string;

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    sharePct: number;

    @IsDateString()
    onProperties: string[]
}