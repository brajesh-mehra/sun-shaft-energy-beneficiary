import { IsString, IsNotEmpty, IsPhoneNumber, IsDate, IsOptional, IsDefined, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBeneficiaryDto {
  @IsDefined({ message: 'Name is required' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a valid string' })
  name: string;

  @IsDefined({ message: 'Beneficiary No. is required' })
  @IsNotEmpty({ message: 'Beneficiary No. cannot be empty' })
  @IsString({ message: 'Beneficiary No. must be a valid string' })
  beneficiaryNo: string;

  @IsDefined({ message: 'Scheme is required' })
  @IsNotEmpty({ message: 'Scheme cannot be empty' })
  @IsString({ message: 'Scheme must be a valid string' })
  scheme: string;

  @IsDefined({ message: 'Mobile No. is required' })
  @IsNotEmpty({ message: 'Mobile No. cannot be empty' })
  @IsPhoneNumber('IN', { message: 'Mobile No. must be a valid phone number' })
  mobileNo: string;

  @IsDefined({ message: 'District is required' })
  @IsNotEmpty({ message: 'District cannot be empty' })
  @IsString({ message: 'District must be a valid string' })
  district: string;

  @IsDefined({ message: 'Taluka is required' })
  @IsNotEmpty({ message: 'Taluka cannot be empty' })
  @IsString({ message: 'Taluka must be a valid string' })
  taluka: string;

  @IsDefined({ message: 'Village is required' })
  @IsNotEmpty({ message: 'Village cannot be empty' })
  @IsString({ message: 'Village must be a valid string' })
  village: string;

  @IsDefined({ message: 'Pump Capacity is required' })
  @IsNotEmpty({ message: 'Pump Capacity cannot be empty' })
  @IsString({ message: 'Pump Capacity must be a valid string' })
  pumpCapacity: string;

  @IsDefined({ message: 'Head is required' })
  @IsNotEmpty({ message: 'Head cannot be empty' })
  @IsString({ message: 'Head must be a valid string' })
  head: string;

  @IsDefined({ message: 'Billed Date is required' })
  @IsNotEmpty({ message: 'Billed Date cannot be empty' })
  @IsDate({ message: 'Billed Date must be a valid date' })
  @Type(() => Date)
  billedDate: Date;

  @IsDefined({ message: 'Invoice No. is required' })
  @IsNotEmpty({ message: 'Invoice No. cannot be empty' })
  @IsString({ message: 'Invoice No. must be a valid string' })
  invoiceNo: string;
}