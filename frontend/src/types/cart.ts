export interface CartItem {
  id: string; // artwork _id or composite key (e.g. artworkId-variantName)
  artworkId?: string; // original artwork ID
  variantName?: string; // e.g., "Pair", "Set of 3", "Small"
  title: string;
  category: string;
  priceINR: number;
  imageUrl?: string;
  dimensions?: string;
  materials?: string;
  quantity: number;
  availability?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
