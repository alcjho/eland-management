import { Test, TestingModule } from '@nestjs/testing';
import { ElandAuthController } from './eland-auth.controller';
import { ElandAuthService } from './eland-auth.service';

describe('ElandAuthController', () => {
  let controller: ElandAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElandAuthController],
      providers: [ElandAuthService],
    }).compile();

    controller = module.get<ElandAuthController>(ElandAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
