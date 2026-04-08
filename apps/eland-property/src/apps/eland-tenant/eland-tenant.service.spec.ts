import { Test, TestingModule } from '@nestjs/testing';
import { ElandTenantService } from './eland-tenant.service';

describe('ElandTenantService', () => {
  let service: ElandTenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElandTenantService],
    }).compile();

    service = module.get<ElandTenantService>(ElandTenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
