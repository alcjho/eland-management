import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ParkingDto {
    @IsString()
    _id: string

    @IsString()
    @IsNotEmpty()
    parking_spot: string

    @IsString()
    @IsOptional()
    vehicle_type: string
}