import { Test, TestingModule } from '@nestjs/testing';
import { ElandTenantController } from './eland-tenant.controller';
import { ElandTenantService } from './eland-tenant.service';

describe('ElandTenantController', () => {
  let controller: ElandTenantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElandTenantController],
      providers: [ElandTenantService],
    }).compile();

    controller = module.get<ElandTenantController>(ElandTenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
