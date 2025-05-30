import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength, ValidateNested } from 'class-validator';

export class LocationDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  property_type: string

  @IsString()
  building_name: string

  @IsString()
  @IsNotEmpty()
  street_no: string

  @IsString()
  @IsNotEmpty()
  street_name: string

  @IsString()
  @IsOptional()
  apt_no: string

  @IsString()
  @IsOptional()
  suite_no: string

  @IsString()
  @IsOptional()
  lot_no: string

  @IsString()
  @IsOptional()
  unit_no: string

  @IsString()
  @IsOptional()
  zipcode: string;

  @IsString()
  @IsOptional()
  pobox?: string;

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