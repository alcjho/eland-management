import { Test, TestingModule } from '@nestjs/testing';
import { ElandAuthService } from './eland-auth.service';

describe('ElandAuthService', () => {
  let service: ElandAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElandAuthService],
    }).compile();

    service = module.get<ElandAuthService>(ElandAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
