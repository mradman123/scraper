import { Document, model, Schema, Types } from 'mongoose';

export interface Education {
  _id?: string;
  university: string;
  degree: string;
  location: string;
  graduationDate: string;
  description: string;
}

export type EducationDocument = Education & Document;

const educationSchema: Schema = new Schema({
  university: {
    required: true,
    minlength: 1,
    trim: true,
    type: String,
  },
  degree: {
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
  graduationDate: {
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

educationSchema.set('toObject', { virtuals: true });
educationSchema.set('toJSON', { virtuals: true });

export default model<EducationDocument>('Education', educationSchema);
