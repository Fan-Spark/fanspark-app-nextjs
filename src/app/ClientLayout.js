'use client';

import { CartProvider } from '@/components/CartProvider';
import { Providers } from './providers';

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      <Providers>{children}</Providers>
    </CartProvider>
  );
} 