import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../apps/eland-location/dto/location.dto';

export class UpdatePropertyDto {

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @IsString()
  @IsOptional()
  locationId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  totalUnits?: number;

  @IsString()
  @IsOptional()
  leaseLabel?: string

  @IsString()
  @IsOptional()
  isMainAsset?: boolean

  @IsString()
  @IsOptional()
  address?: string

  @IsString()
  @IsOptional()
  zipcode?: string;

  @IsString()
  @IsOptional()
  pobox?: string;

  @IsString()
  @IsOptional()
  isSold?: boolean;


  @ValidateNested()
  @IsOptional()
  city?: string;

  @ValidateNested()
  @IsOptional()
  province?: string

  @ValidateNested()
  @IsOptional()
  country?: string
}