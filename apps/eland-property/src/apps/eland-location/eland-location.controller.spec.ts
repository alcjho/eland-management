import { Test, TestingModule } from '@nestjs/testing';
import { ElandLocationController } from './eland-location.controller';
import { ElandLocationService } from './eland-location.service';

describe('ElandLocationController', () => {
  let controller: ElandLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElandLocationController],
      providers: [ElandLocationService],
    }).compile();

    controller = module.get<ElandLocationController>(ElandLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
