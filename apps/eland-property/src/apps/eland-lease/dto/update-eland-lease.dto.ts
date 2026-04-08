import { PartialType } from '@nestjs/mapped-types';
import { CreateElandLeaseDto } from './create-eland-lease.dto';

export class UpdateElandLeaseDto extends PartialType(CreateElandLeaseDto) {}
