import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TenantDto {
    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    prevAddress: string

    @IsString()
    @IsNotEmpty()
    homePhone: string

    @IsString()
    @IsOptional()
    cellPhone: string

    @IsString()
    @IsNotEmpty()
    contactPhone: string

    @IsString()
    @IsNotEmpty()
    earningCycle: string

    @IsNotEmpty()
    @IsString()
    earning: number
    
    @IsString()
    @IsNotEmpty()
    dependents: number

    @IsString()
    @IsNotEmpty()
    occupants: number

    @IsString()
    @IsNotEmpty()
    industry: string

    @IsString()
    @IsNotEmpty()
    jobType: string

    @IsString()
    @IsOptional()
    company: string
    
    @IsString()
    @IsOptional()
    workPhone: string

    @IsString()
    @IsOptional()
    jobTitle: string
}