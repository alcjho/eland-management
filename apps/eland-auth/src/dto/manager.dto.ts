import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ManagerDto {
    @IsString()
    @IsNotEmpty()
    ownerId: string;

    @IsString()
    @IsNotEmpty()
    managerUserId: string;

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
    workingStatus: string

    @IsString()
    @IsNotEmpty()
    refPhone: string;
}