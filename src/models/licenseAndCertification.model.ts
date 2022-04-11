import { Document, model, Schema, Types } from 'mongoose';

export interface LicenseAndCertification {
  _id?: string;
  title: string;
  employer: string;
  certificationPeriod: string;
  description: string;
}

export type LicenseAndCertificationDocument = LicenseAndCertification &
  Document;

const licenseAndCertificationSchema: Schema = new Schema({
  title: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  employer: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  certificationPeriod: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  description: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
});

licenseAndCertificationSchema.set('toObject', { virtuals: true });
licenseAndCertificationSchema.set('toJSON', { virtuals: true });

export default model<LicenseAndCertificationDocument>(
  'LicenseAndCertification',
  licenseAndCertificationSchema
);
