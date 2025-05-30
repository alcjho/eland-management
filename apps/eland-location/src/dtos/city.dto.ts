import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CityDto {
  @IsOptional()
  @IsString()
  _id?: string; // MongoDB ObjectId (optional)

  @IsString()
  @IsNotEmpty()
  name: Object

  @IsString()
  @IsNotEmpty()
  code: string
}