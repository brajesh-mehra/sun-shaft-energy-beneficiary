import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { BeneficiaryManagement } from '../schemas/beneficiary-management.schema';
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
        const query: any = { isDeleted: { $ne: true } };
        const andConditions: any[] = [];

        if (filters.search) {
            andConditions.push({
                $or: [
                    { companyName: { $regex: filters.search, $options: 'i' } },
                    { name: { $regex: filters.search, $options: 'i' } },
                    { mobileNo: { $regex: filters.search, $options: 'i' } },
                    { beneficiaryNo: { $regex: filters.search, $options: 'i' } },
                    { village: { $regex: filters.search, $options: 'i' } },
                ]
            });
        }

        if (filters.companyName) {
            andConditions.push({ companyName: { $regex: filters.companyName, $options: 'i' } });
        }

        if (filters.district) {
            andConditions.push({ district: { $regex: filters.district, $options: 'i' } });
        }

        if (filters.taluka) {
            andConditions.push({ taluka: { $regex: filters.taluka, $options: 'i' } });
        }

        if (filters.village) {
            andConditions.push({ village: { $regex: filters.village, $options: 'i' } });
        }

        if (filters.scheme) {
            andConditions.push({ scheme: { $regex: filters.scheme, $options: 'i' } });
        }

        if (filters.deliveryStatus) {
            andConditions.push({ deliveryStatus: { $regex: filters.deliveryStatus, $options: 'i' } });
        }

        if (filters.districtTalukaFilter && Object.keys(filters.districtTalukaFilter).length > 0) {
            const districtTalukaConditions: any[] = [];

            for (const [district, talukas] of Object.entries(filters.districtTalukaFilter)) {
                if (district && Array.isArray(talukas) && talukas.length > 0) {
                    districtTalukaConditions.push({
                        district: district,
                        taluka: { $in: talukas }
                    });
                }
            }

            if (districtTalukaConditions.length > 0) {
                andConditions.push({ $or: districtTalukaConditions });
            }
        }

        if (andConditions.length > 0) {
            query.$and = andConditions;
        }

        let sortOptions: { [key: string]: SortOrder } = { createdAt: -1 };
        if (filters.sort) {
            const allowedSortFields = ['isActive', 'district', 'taluka', 'billedDate'];
            if (allowedSortFields.includes(filters.sort)) {
                sortOptions = { [filters.sort]: filters.order === 'asc' ? 1 : -1 };
            }
        }

        return this.beneficiaryModel.find(query).sort(sortOptions).exec();
    }

    async getDashboardStatistics() {
        const deliveredCount = await this.beneficiaryModel.countDocuments({
            deliveryStatus: 'DELIVERED',
        });

        const waitingCount = await this.beneficiaryModel.countDocuments({
            deliveryStatus: { $ne: 'DELIVERED' },
        });

        return {
            deliveredBeneficiaries: deliveredCount,
            waitingBeneficiaries: waitingCount,
        };
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
            if (!row.companyName || !row.name || !row.beneficiaryNo || !row.mobileNo) {
                throw new BadRequestException('Each beneficiary must have a companyName, name, beneficiaryNo, and mobileNo');
            }

            return {
                companyName: row.companyName,
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
