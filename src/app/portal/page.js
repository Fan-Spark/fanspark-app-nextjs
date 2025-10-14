import PortalClient from './PortalClient';

export const metadata = {
  title: "User Portal - FanSpark's",
  description: "Manage your profile and wallet settings with Dynamic.xyz",
  openGraph: {
    title: "User Portal - FanSpark's",
    description: "Manage your profile and wallet settings with Dynamic.xyz",
    images: ['https://checkout.fanspark.xyz/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "User Portal - FanSpark's",
    description: "Manage your profile and wallet settings with Dynamic.xyz",
    images: ['https://checkout.fanspark.xyz/preview.png'],
  },
};

export default function PortalPage() {
  return <PortalClient />;
} 