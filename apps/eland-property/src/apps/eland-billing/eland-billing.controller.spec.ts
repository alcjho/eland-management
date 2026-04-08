import { Test, TestingModule } from '@nestjs/testing';
import { ElandBillingController } from './eland-billing.controller';
import { ElandBillingService } from './eland-billing.service';

describe('ElandBillingController', () => {
  let controller: ElandBillingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElandBillingController],
      providers: [ElandBillingService],
    }).compile();

    controller = module.get<ElandBillingController>(ElandBillingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
