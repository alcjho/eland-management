import { IsNotEmpty, IsString, ValidateNested } from "class-validator"
import { ParkingDto } from "./Parking.dto"
import { PossessionDto } from "./Possession.dto"

export class PropertyTypeDto {
    @IsString()
    _id: string

    @IsString()
    @IsNotEmpty()
    name_en: string

    @IsString()
    @IsNotEmpty()
    name_fr: string
}