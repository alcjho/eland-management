import { Test, TestingModule } from '@nestjs/testing';
import { ElandLeaseService } from './eland-lease.service';

describe('ElandLeaseService', () => {
  let service: ElandLeaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElandLeaseService],
    }).compile();

    service = module.get<ElandLeaseService>(ElandLeaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
