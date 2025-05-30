import { ValidateNested, IsNumber } from 'class-validator';
import { PropertyDto } from './Property.dto';


export class ListPropertiesDto {
  @ValidateNested()
  properties: PropertyDto[];
}
