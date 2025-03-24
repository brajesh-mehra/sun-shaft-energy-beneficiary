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
}
