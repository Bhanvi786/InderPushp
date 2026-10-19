import mongoose, { Schema, Document } from 'mongoose';

export interface IContactEnquiry extends Document {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ContactEnquirySchema = new Schema<IContactEnquiry>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      maxlength: 120,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 25,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Enquiry category/subject is required'],
      trim: true,
      enum: [
        'Enquiry About an Artwork',
        'Personalised Commission',
        'Bulk or Corporate Enquiry',
        'General Question',
        'Other',
      ],
      default: 'General Question',
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export const ContactEnquiry = mongoose.model<IContactEnquiry>('ContactEnquiry', ContactEnquirySchema);
