import { Test, TestingModule } from '@nestjs/testing';
import { ElandLeaseController } from './eland-lease.controller';
import { ElandLeaseService } from './eland-lease.service';

describe('ElandLeaseController', () => {
  let controller: ElandLeaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElandLeaseController],
      providers: [ElandLeaseService],
    }).compile();

    controller = module.get<ElandLeaseController>(ElandLeaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
