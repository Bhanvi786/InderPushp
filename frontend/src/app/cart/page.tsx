import CartPageComponent from '@/components/CartPageComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | InderPushp House of Art',
  description: 'Review your selected luxury mosaic artworks and proceed to secure acquisition.',
};

export default function CartPage() {
  return <CartPageComponent />;
}
