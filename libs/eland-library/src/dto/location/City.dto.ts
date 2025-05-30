import { IsNotEmpty, IsString } from "class-validator";

export class CityDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsString()
  @IsNotEmpty()
  name_fr: string;
}