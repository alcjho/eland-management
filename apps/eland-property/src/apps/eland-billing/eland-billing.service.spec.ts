import { Test, TestingModule } from '@nestjs/testing';
import { ElandBillingService } from './eland-billing.service';

describe('ElandBillingService', () => {
  let service: ElandBillingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElandBillingService],
    }).compile();

    service = module.get<ElandBillingService>(ElandBillingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
