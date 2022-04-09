import { Document, model, Schema, Types } from 'mongoose';

export interface UserProfile {
  _id?: string;
  aboutMe: string;
  email: string;
}

export type UserProfileDocument = UserProfile & Document;

const userProfileSchema: Schema = new Schema({
  _id: {
    required: true,
    type: String,
  },
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
});

userProfileSchema.set('toObject', { virtuals: true });
userProfileSchema.set('toJSON', { virtuals: true });

export default model<UserProfileDocument>('UserProfile', userProfileSchema);
