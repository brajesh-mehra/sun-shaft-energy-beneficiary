import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { BeneficiaryManagement } from '../schemas/stock-management.schema';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';

@Injectable()
export class BeneficiaryManagementService {
    constructor(
        @InjectModel(BeneficiaryManagement.name) private beneficiaryModel: Model<BeneficiaryManagement>
    ) { }
    
    async create(createBeneficiaryDto: CreateBeneficiaryDto): Promise<BeneficiaryManagement> {
        const beneficiary = new this.beneficiaryModel(createBeneficiaryDto);
        return beneficiary.save();
    }

    async findAll(filters: any): Promise<BeneficiaryManagement[]> {
        const query: any = {};
        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { mobileNo: { $regex: filters.search, $options: 'i' } },
                { beneficiaryNo: { $regex: filters.search, $options: 'i' } },
            ];
        }
        
        query.isDeleted = { $ne: true };
        
        let sortOptions: { [key: string]: SortOrder } = { createdAt: -1 };
        
        if (filters.sort) {
            const allowedSortFields = ['isActive', 'district', 'taluka', 'billedDate'];
            
            if (allowedSortFields.includes(filters.sort)) {
                sortOptions = { [filters.sort]: filters.order === 'asc' ? 1 : -1 }; 
            }
        }
    
        return this.beneficiaryModel.find(query).sort(sortOptions).exec();
    }

    async findOne(id: string): Promise<BeneficiaryManagement | null> {
        return this.beneficiaryModel.findById(id).exec();
    }

    async update(id: string, updateBeneficiaryDto: UpdateBeneficiaryDto): Promise<BeneficiaryManagement | null> {
        if (!updateBeneficiaryDto) {
            throw new BadRequestException('Update data is required');
        }
        return this.beneficiaryModel.findByIdAndUpdate(id, updateBeneficiaryDto, { new: true }).exec();
    }

    async remove(id: string): Promise<{ message: string }> {
        const beneficiary = await this.beneficiaryModel.findByIdAndUpdate(id, { isActive: false, isDeleted: true }, { new: true }).exec();

        if (!beneficiary) {
            throw new NotFoundException('Beneficiary not found');
        }

        return { message: 'Beneficiary deleted successfully' };
    }

    async saveBeneficiaryExcelData(sheetData: any[]): Promise<{ message: string; count: number }> {
        if (!sheetData || sheetData.length === 0) {
            throw new BadRequestException('Excel file contains no data');
        }
    
        // Mapping sheet data to beneficiary DTO
        const beneficiaryData = sheetData.map(row => {
            if (!row.name || !row.beneficiaryNo || !row.mobileNo) {
                throw new BadRequestException('Each beneficiary must have a name, beneficiaryNo, and mobileNo');
            }
    
            return {
                name: row.name,
                beneficiaryNo: row.beneficiaryNo,
                scheme: row.scheme || '',
                mobileNo: row.mobileNo,
                district: row.district || '',
                taluka: row.taluka || '',
                village: row.village || '',
                pumpCapacity: row.pumpCapacity || '',
                head: row.head || '',
                billedDate: row.billedDate ? new Date(row.billedDate) : null,
                invoiceNo: row.invoiceNo || '',
            } as CreateBeneficiaryDto;
        });
    
        const result = await this.beneficiaryModel.insertMany(beneficiaryData);
        
        return { message: 'Beneficiary data saved successfully', count: result.length };
    }
}
