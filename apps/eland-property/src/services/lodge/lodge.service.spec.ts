import { Test, TestingModule } from '@nestjs/testing';
import { LodgeService } from './lodge.service';

describe('LodgeService', () => {
  let service: LodgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LodgeService],
    }).compile();

    service = module.get<LodgeService>(LodgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
