import { Test, TestingModule } from '@nestjs/testing';
import { PossessionService } from './possession.service';

describe('PossessionService', () => {
  let service: PossessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PossessionService],
    }).compile();

    service = module.get<PossessionService>(PossessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
