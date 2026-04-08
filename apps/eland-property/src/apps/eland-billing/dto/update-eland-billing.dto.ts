import { PartialType } from '@nestjs/mapped-types';
import { CreateElandBillingDto } from './create-eland-billing.dto';

export class UpdateElandBillingDto extends PartialType(CreateElandBillingDto) {}
