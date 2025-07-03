import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { CartProvider } from '@/components/CartProvider';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { ToastProvider } from '@/components/common/ToastProvider';
import FloatingChat from '@/components/common/FloatingChat';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FanSpark's",
  description: "A platform for minting and managing NFT collections on the Base Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" storageKey="fanspark-theme">
          <CartProvider>
            <Providers>
              {children}
            </Providers>
            <ToastProvider />
            <FloatingChat />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
