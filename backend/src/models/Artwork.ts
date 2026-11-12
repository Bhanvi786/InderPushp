import mongoose, { Document, Schema } from 'mongoose';

export interface IArtworkImage {
  url: string;
  publicId?: string;
  alt?: string;
  isMain?: boolean;
}

export interface IArtworkVariant {
  name: string; // e.g., "Single Piece", "Pair", "Set of 3", "Small", "Large"
  priceINR: number;
  dimensions?: string;
  imageUrl?: string; // Optional variant image (e.g. for color/finish variants)
  colorHex?: string; // Optional hex code for swatch display e.g. "#2E7D32"
}

export interface IArtworkColorOption {
  name: string; // e.g. "Emerald Green", "Royal Amber", "Sapphire Blue"
  colorHex?: string; // e.g. "#1B4D3E"
  imageUrl?: string; // Photo of this color
  priceINR?: number; // Optional price override if color has different price
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
  variants: IArtworkVariant[];
  colorOptions: IArtworkColorOption[];
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

const ArtworkVariantSchema = new Schema<IArtworkVariant>(
  {
    name: { type: String, required: true, trim: true },
    priceINR: { type: Number, required: true, min: 0 },
    dimensions: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '' },
    colorHex: { type: String, default: '' },
  },
  { _id: false }
);

const ArtworkColorOptionSchema = new Schema<IArtworkColorOption>(
  {
    name: { type: String, required: true, trim: true },
    colorHex: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '', trim: true },
    priceINR: { type: Number, default: 0 },
  },
  { _id: false }
);

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
    variants: {
      type: [ArtworkVariantSchema],
      default: [],
    },
    colorOptions: {
      type: [ArtworkColorOptionSchema],
      default: [],
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
