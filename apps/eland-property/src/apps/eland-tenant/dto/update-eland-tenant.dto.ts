import { PartialType } from '@nestjs/mapped-types';
import { CreateElandTenantDto } from './create-eland-tenant.dto';

export class UpdateElandTenantDto extends PartialType(CreateElandTenantDto) {}
