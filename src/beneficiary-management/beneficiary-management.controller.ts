import { BadRequestException, Controller, NotFoundException } from '@nestjs/common';
import { BeneficiaryManagementService } from './beneficiary-management.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { isValidObjectId } from 'mongoose';

@Controller('beneficiary-management')
export class BeneficiaryManagementController {
    constructor(private readonly beneficiaryManagementService: BeneficiaryManagementService) { }

    @MessagePattern('getAllBeneficiaries')
    async getAllBeneficiaries(@Payload() filters: any) {
        return this.beneficiaryManagementService.findAll(filters);
    }

    @MessagePattern('getBeneficiary')
    async getBeneficiary(@Payload() { id }: { id: string }) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid beneficiary ID.`);
        }

        const beneficiary = await this.beneficiaryManagementService.findOne(id);
        if (!beneficiary) {
            throw new NotFoundException(`No beneficiary found with the given ID.`);
        }

        return beneficiary;
    }

    @MessagePattern('createBeneficiary')
    async createBeneficiary(@Payload() createBeneficiaryDto: CreateBeneficiaryDto) {
        return this.beneficiaryManagementService.create(createBeneficiaryDto);
    }

    @MessagePattern('updateBeneficiary')
    async updateBeneficiary(@Payload() { id, ...updateBeneficiaryDto }: { id: string } & UpdateBeneficiaryDto) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid beneficiary ID.`);
        }

        const updatedBeneficiary = await this.beneficiaryManagementService.update(id, updateBeneficiaryDto);

        if (!updatedBeneficiary) {
            throw new NotFoundException('Beneficiary not found.');
        }

        return updatedBeneficiary;
    }

    @MessagePattern('deleteBeneficiary')
    async deleteBeneficiary(@Payload() { id }: { id: string }) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid beneficiary ID format.');
        }
        return await this.beneficiaryManagementService.remove(id);
    }
}
