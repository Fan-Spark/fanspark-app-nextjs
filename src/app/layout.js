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
  description: "Where fans and creators unite to spark ideas to life 💡",
  metadataBase: new URL('https://checkout.fanspark.xyz'),
  openGraph: {
    title: "FanSpark's",
    description: "Where fans and creators unite to spark ideas to life 💡",
    url: 'https://checkout.fanspark.xyz',
    siteName: "FanSpark's",
    images: [
      {
        url: 'https://checkout.fanspark.xyz/preview.png',
        width: 1200,
        height: 630,
        alt: 'FanSpark - Where fans and creators unite to spark ideas to life',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FanSpark's",
    description: "Where fans and creators unite to spark ideas to life 💡",
    images: ['https://checkout.fanspark.xyz/preview.png'],
    creator: '@aamirorbit',
    site: '@FanSpark_',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
