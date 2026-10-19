import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'artist';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'InderPushp Studio Admin',
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'artist'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
