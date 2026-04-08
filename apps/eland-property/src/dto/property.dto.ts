import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, ValidateNested, IsUUID } from 'class-validator';

export class PropertyDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  // optional location reference; empty string will be rejected by IsUUID
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
  @IsOptional()
  coverImageId?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  totalUnits: number;

  @IsString()
  @IsNotEmpty()
  leaseLabel: string

  @IsString()
  @IsNotEmpty()
  isMainAsset: boolean

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