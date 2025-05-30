import { IsNotEmpty, IsString, ValidateNested } from "class-validator"
import { ParkingDto } from "./Parking.dto"
import { PossessionDto } from "./Possession.dto"

export class LodgeDto {
    @IsString()
    _id: string

    @IsString()
    name_en: string

    @IsString()
    name_fr: string

    @IsString()
    @IsNotEmpty()
    lodge_number: string

    @IsString()
    @IsNotEmpty()
    lodge_size: string

    @ValidateNested()
    parkings: ParkingDto[]

    @ValidateNested()
    possessions: PossessionDto[]
}