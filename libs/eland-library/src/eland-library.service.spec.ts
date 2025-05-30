import { Test, TestingModule } from '@nestjs/testing';
import { ElandLibraryService } from './eland-library.service';

describe('ElandLibraryService', () => {
  let service: ElandLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElandLibraryService],
    }).compile();

    service = module.get<ElandLibraryService>(ElandLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
