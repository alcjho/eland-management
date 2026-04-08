import { IsString, IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { RoleDto } from './Role.dto';

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ValidateNested()
  role: RoleDto;

  @IsString()
  permissions: string
}