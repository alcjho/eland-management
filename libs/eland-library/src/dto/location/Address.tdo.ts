import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CityDto } from "./City.dto";
import { StateDto } from "./state.dto";

export class AddressDto {
  @IsString()
  _id: string
  
  @IsString()
  @IsNotEmpty()
  street_en: string;

  @IsString()
  @IsNotEmpty()
  street_fr: string;

  @IsString()
  @IsNotEmpty()
  street_number: string;

  @ValidateNested()
  city: CityDto;

  @ValidateNested()
  state: StateDto;

  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @IsString()
  @IsNotEmpty()
  pobox: string;
}