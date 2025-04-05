import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BeneficiaryManagement extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  beneficiaryNo: string;

  @Prop({ required: true })
  scheme: string;

  @Prop({ required: true })
  mobileNo: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  taluka: string;

  @Prop({ required: true })
  village: string;

  @Prop({ required: true })
  pumpCapacity: string;

  @Prop({ required: true })
  head: string;

  @Prop({ required: true })
  billedDate: Date;

  @Prop({ required: true })
  invoiceNo: string;

  @Prop({ default: true }) 
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

// Generate Schema
const BeneficiaryManagementSchema = SchemaFactory.createForClass(BeneficiaryManagement);

BeneficiaryManagementSchema.set('toJSON', {
  transform: function (doc, ret) {
      delete ret.isActive;
      delete ret.isDeleted;
      delete ret.updatedAt;
      delete ret.__v;
      return ret;
  }
});

export { BeneficiaryManagementSchema };