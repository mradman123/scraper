import { Document, model, Schema, Types } from 'mongoose';

export interface Experience {
  _id?: string;
  title: string;
  employer: string;
  location: string;
  employmentPeriod: string;
  description: string;
}

export type ExperienceDocument = Experience & Document;

const experienceSchema: Schema = new Schema({
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
  location: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  employmentPeriod: {
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

experienceSchema.set('toObject', { virtuals: true });
experienceSchema.set('toJSON', { virtuals: true });

export default model<ExperienceDocument>('Experience', experienceSchema);
