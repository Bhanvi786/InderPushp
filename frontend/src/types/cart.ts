export interface CartItem {
  id: string; // artwork _id
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
