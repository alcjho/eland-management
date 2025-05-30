import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, ValidateNested } from 'class-validator';

export class PropertyDto {
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsOptional()
  locationId: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  totalUnits: number;

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsOptional()
  zipcode: string;

  @IsString()
  @IsOptional()
  pobox?: string;

  @IsString()
  @IsOptional()
  isSold?: boolean;


  @ValidateNested()
  @IsNotEmpty()
  city: string;

  @ValidateNested()
  @IsNotEmpty()
  province: string

  @ValidateNested()
  @IsNotEmpty()
  country: string
}