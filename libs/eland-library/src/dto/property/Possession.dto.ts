import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class PossessionDto {
    @IsString()
    _id: string
    
    @IsString()
    @IsNotEmpty()
    name_en: string

    @IsString()
    @IsNotEmpty()
    name_fr: string

    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @IsString()
    description: string

    @IsNumber()
    @IsOptional()
    value: number
}