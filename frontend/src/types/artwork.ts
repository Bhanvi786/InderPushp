export interface ArtworkImage {
  url: string;
  publicId?: string;
  alt?: string;
  isMain?: boolean;
}

export type ArtworkCategory = string;

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  artworkCount?: number;
  totalArtworks?: number;
  publishedArtworks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AvailabilityStatus =
  | 'In Stock'
  | 'Made to Order'
  | 'Sold'
  | 'Enquiry Only';

export interface Artwork {
  _id: string;
  title: string;
  description: string;
  category: string;
  priceINR: number;
  mainImage: ArtworkImage;
  additionalImages: ArtworkImage[];
  dimensions?: string;
  materials?: string;
  availability: AvailabilityStatus;
  stockQuantity: number;
  estimatedProductionTime?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkStats {
  totalArtworks: number;
  publishedArtworks: number;
  draftArtworks: number;
  availableArtworks: number;
  inStockArtworks: number;
  madeToOrderArtworks: number;
  soldArtworks: number;
  enquiryOnlyArtworks: number;
  featuredArtworks: number;
  categories: { category: string; count: number }[];
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  email?: string;
}
