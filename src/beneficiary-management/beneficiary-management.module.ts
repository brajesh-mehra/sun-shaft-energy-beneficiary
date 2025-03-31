import { Module } from '@nestjs/common';
import { BeneficiaryManagementController } from './beneficiary-management.controller';
import { BeneficiaryManagementService } from './beneficiary-management.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BeneficiaryManagement, BeneficiaryManagementSchema } from '../schemas/beneficiary-management.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BeneficiaryManagement.name, schema: BeneficiaryManagementSchema }]),
  ],
  controllers: [BeneficiaryManagementController],
  providers: [BeneficiaryManagementService]
})
export class BeneficiaryManagementModule {}
