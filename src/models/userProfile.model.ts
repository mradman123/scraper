import { Document, model, Schema, Types } from 'mongoose';
import EducationModel, {
  Education,
  EducationDocument,
} from './education.model';
import ExperienceModel, {
  Experience,
  ExperienceDocument,
} from './experience.model';
import LicenseAndCertificationModel, {
  LicenseAndCertification,
  LicenseAndCertificationDocument,
} from './licenseAndCertification.model';

export interface UserProfile {
  _id?: string;
  aboutMe: string;
  email: string;
  experiences: (Experience | string)[];
  skills: string[];
  suggestedSkills: string[];
  educations: (Education | string)[];
  licenseAndCertifications: (LicenseAndCertification | string)[];
  pdfFileName: string;
  pdfURL: string;
}

export type UserProfileDocument = UserProfile & Document;

const userProfileSchema: Schema = new Schema({
  aboutMe: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  email: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  experiences: {
    required: true,
    type: [{ ref: 'Experience', type: Types.ObjectId }],
  },
  skills: {
    required: true,
    type: [String],
  },
  suggestedSkills: {
    required: true,
    type: [String],
  },
  educations: {
    required: true,
    type: [{ ref: 'Education', type: Types.ObjectId }],
  },
  licenseAndCertifications: {
    required: true,
    type: [{ ref: 'LicenseAndCertification', type: Types.ObjectId }],
  },
  pdfFileName: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  pdfURL: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
});

userProfileSchema.set('toObject', { virtuals: true });
userProfileSchema.set('toJSON', { virtuals: true });

export default model<UserProfileDocument>('UserProfile', userProfileSchema);
