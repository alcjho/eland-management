import { PartialType } from '@nestjs/mapped-types';
import { CreateElandLocationDto } from './create-eland-location.dto';

export class UpdateElandLocationDto extends PartialType(CreateElandLocationDto) {}
