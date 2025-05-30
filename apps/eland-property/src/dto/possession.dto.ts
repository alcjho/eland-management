import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class PossessionDto {
    @IsString()
    _id: string

    @IsString()
    @IsNotEmpty()
    propertyId: string
    
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    category: string

    @IsString()
    @IsOptional()
    condition: string

    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @IsString()
    description: string

    @IsNumber()
    @IsOptional()
    value: number
}