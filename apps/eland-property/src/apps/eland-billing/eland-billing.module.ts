import { Module } from '@nestjs/common';
import { ElandBillingService } from './eland-billing.service';
import { ElandBillingController } from './eland-billing.controller';

@Module({
  controllers: [ElandBillingController],
  providers: [ElandBillingService],
})
export class ElandBillingModule {}
