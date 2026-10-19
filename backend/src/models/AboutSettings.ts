import mongoose, { Document, Schema } from 'mongoose';

export interface IAboutSettings extends Document {
  videoUrl: string;
  posterUrl: string;
  heading?: string;
  subheading?: string;
  updatedAt: Date;
}

const AboutSettingsSchema = new Schema<IAboutSettings>(
  {
    videoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    posterUrl: {
      type: String,
      default: '',
      trim: true,
    },
    heading: {
      type: String,
      default: 'A Little More of My World',
      trim: true,
    },
    subheading: {
      type: String,
      default: 'Step into my creative space and discover the little pieces, colours and stories that come together to make each artwork.',
      trim: true,
    },
  },
  { timestamps: true }
);

export const AboutSettings = mongoose.model<IAboutSettings>('AboutSettings', AboutSettingsSchema);
