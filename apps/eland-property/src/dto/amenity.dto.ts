import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, ValidateNested } from 'class-validator';

export class AmenityDto {

    @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  isPremium: boolean;

  @IsString()
  @IsOptional()
  features: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  extra_cost: Number
}