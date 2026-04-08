import { Test, TestingModule } from '@nestjs/testing';
import { ElandLocationService } from './eland-location.service';

describe('ElandLocationService', () => {
  let service: ElandLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElandLocationService],
    }).compile();

    service = module.get<ElandLocationService>(ElandLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
