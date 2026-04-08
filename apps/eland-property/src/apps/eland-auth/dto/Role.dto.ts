import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RoleDto {
  @IsString()
  @IsOptional()
  _id: string

  @IsString()
  @IsNotEmpty()
  name: string;
}