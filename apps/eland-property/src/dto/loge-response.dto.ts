import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, ValidateNested, IsNumber } from 'class-validator';

export class LodgeResponseDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  data?: any
}