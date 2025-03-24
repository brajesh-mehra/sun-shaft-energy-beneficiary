import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryManagementService } from './beneficiary-management.service';

describe('BeneficiaryManagementService', () => {
  let service: BeneficiaryManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeneficiaryManagementService],
    }).compile();

    service = module.get<BeneficiaryManagementService>(BeneficiaryManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
