import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryManagementController } from './beneficiary-management.controller';

describe('BeneficiaryManagementController', () => {
  let controller: BeneficiaryManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeneficiaryManagementController],
    }).compile();

    controller = module.get<BeneficiaryManagementController>(BeneficiaryManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
