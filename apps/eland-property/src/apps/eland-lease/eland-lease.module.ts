import { Module } from '@nestjs/common';
import { ElandLeaseService } from './eland-lease.service';
import { ElandLeaseController } from './eland-lease.controller';

@Module({
  controllers: [ElandLeaseController],
  providers: [ElandLeaseService],
})
export class ElandLeaseModule {}
