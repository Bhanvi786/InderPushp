import mongoose, { Document, Schema } from 'mongoose';

export interface IArtworkImage {
  url: string;
  publicId?: string;
  alt?: string;
  isMain?: boolean;
}

export type ArtworkCategory = string;

export type AvailabilityStatus =
  | 'In Stock'
  | 'Made to Order'
  | 'Sold'
  | 'Enquiry Only';

export interface IArtwork extends Document {
  title: string;
  description?: string;
  category: string;
  priceINR: number;
  mainImage: IArtworkImage;
  additionalImages: IArtworkImage[];
  dimensions?: string; // e.g., "24 x 36 inches"
  materials?: string; // e.g., "Stained Glass, Italian Smalti, Ceramic tiles"
  availability: AvailabilityStatus;
  stockQuantity: number;
  estimatedProductionTime?: string; // e.g., "2-3 weeks"
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArtworkImageSchema = new Schema<IArtworkImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    isMain: { type: Boolean, default: false },
  },
  { _id: false }
);

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: {
      type: String,
      required: [true, 'Artwork title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Floral & Nature',
      index: true,
    },
    priceINR: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
      default: 0,
    },
    mainImage: {
      type: ArtworkImageSchema,
      required: [true, 'Main artwork image is required'],
    },
    additionalImages: {
      type: [ArtworkImageSchema],
      default: [],
    },
    dimensions: {
      type: String,
      default: '',
      trim: true,
    },
    materials: {
      type: String,
      default: '',
      trim: true,
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Made to Order', 'Sold', 'Enquiry Only'],
      default: 'In Stock',
      required: true,
    },
    stockQuantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    estimatedProductionTime: {
      type: String,
      default: '',
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient ordering and filtering
ArtworkSchema.index({ displayOrder: 1, createdAt: -1 });

export const Artwork = mongoose.model<IArtwork>('Artwork', ArtworkSchema);
