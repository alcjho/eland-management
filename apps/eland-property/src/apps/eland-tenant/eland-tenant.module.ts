import { Module } from '@nestjs/common';
import { ElandTenantService } from './eland-tenant.service';
import { ElandTenantController } from './eland-tenant.controller';

@Module({
  controllers: [ElandTenantController],
  providers: [ElandTenantService],
})
export class ElandTenantModule {}
