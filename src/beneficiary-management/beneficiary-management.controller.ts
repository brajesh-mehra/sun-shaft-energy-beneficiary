import { BadRequestException, Controller, NotFoundException } from '@nestjs/common';
import { BeneficiaryManagementService } from './beneficiary-management.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';
import { isValidObjectId } from 'mongoose';
import * as xlsx from 'xlsx';

@Controller('beneficiary-management')
export class BeneficiaryManagementController {
    constructor(private readonly beneficiaryManagementService: BeneficiaryManagementService) { }

    @MessagePattern('getAllBeneficiaries')
    async getAllBeneficiaries(@Payload() filters: any) {
        return this.beneficiaryManagementService.findAll(filters);
    }

    @MessagePattern('getDashboardStatistics')
    async getDashboardStatistics() {
        return this.beneficiaryManagementService.getDashboardStatistics();
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

    @MessagePattern('uploadBeneficiaryExcel')
    async uploadBeneficiaryExcel(payload: { file: string }) {
        try {
            const fileBuffer = Buffer.from(payload.file, 'base64');
            const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            if (!sheetData.length) {
                throw new BadRequestException('Excel file is empty');
            }

            return await this.beneficiaryManagementService.saveBeneficiaryExcelData(sheetData);

        } catch (error) {
            throw new BadRequestException('Invalid Excel file');
        }
    }
}
