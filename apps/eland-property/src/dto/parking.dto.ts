import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, ValidateNested } from 'class-validator';

export class ParkingDto {
  
  @IsString()
  @IsNotEmpty()
  propertyId: string;
  
  @IsString()
  @IsNotEmpty()
  slotNumber: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @IsString()
  @IsOptional()
  chargePerHour: number;
}