import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  _id?: string; // MongoDB ObjectId (optional)

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  role?: string; // Example: 'admin', 'user'

  @IsOptional()
  blockedPermissions?: string[]
}