import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { LeaseType } from '../entities/lodge.entity';

export class LodgeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  lodgeNumber: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(LeaseType)
  @IsNotEmpty()
  leaseType: LeaseType;

  @IsNumber()
  @IsOptional()
  price?: number;
}