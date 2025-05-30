import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, ValidateNested } from 'class-validator';

export class LodgeDto {
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
  lodge_number: string;

  @IsString()
  @IsNotEmpty()
  Floor_number: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  leaseType: string;

  @IsString()
  @IsOptional()
  price: Number
}