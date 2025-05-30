import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"
import { ParkingDto } from "./Parking.dto"
import { PropertyTypeDto } from "./PropertyType.dto"
import { LodgeDto } from "./Lodge.dto"



export class PropertyDto {
    @IsString()
    _id: string

    @IsString()
    name_en: string

    @IsString()
    name_fr: string

    @ValidateNested()
    property_type: PropertyTypeDto

    @IsNumber()
    parking_size: number

    @IsNumber()
    lodge_size: number

    @ValidateNested()
    parkings: ParkingDto[]

    @ValidateNested()
    lodges: LodgeDto[]
}