'use client';

import { useState, useEffect } from "react";
import { useDynamicWallet } from '@/hooks/useDynamicWallet';
import { useTheme } from '@/components/common/ThemeProvider';
import { usePathname, useParams } from "next/navigation";
import { CURRENT_NETWORK } from '@/utils/networkConfig';
import GlobalSidebar from '@/components/common/GlobalSidebar';
import CampaignSidebar from '@/components/campaigns/CampaignSidebar';
import { getCampaignBySlug } from '@/data/campaigns';
import DynamicWalletButton from '@/components/common/DynamicWalletButton';
import DynamicMobileWallet from '@/components/common/DynamicMobileWallet';
import DonationModal from '@/components/common/DonationModal';
import NoSSR from '@/components/common/NoSSR';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { 
  Wallet, 
  Moon, 
  Sun,
  Menu,
  Sparkles,
  User,
  Heart
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export default function Template({ children }) {
  const { 
    isConnected, 
    isConnecting, 
    walletAddress, 
    network,
    connect,
    disconnect
  } = useDynamicWallet();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState('');
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const params = useParams();

  // Determine if we're in a campaign context
  const isCampaignPage = pathname.startsWith('/campaigns/');
  const currentCampaign = isCampaignPage && params.slug ? getCampaignBySlug(params.slug) : null;

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Set current year on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Desktop Floating Sidebar */}
      <div className="fixed left-4 top-4 h-[calc(100vh-2rem)] w-80 bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl transition-all duration-500 z-50 hidden lg:block">
        <div className="flex flex-col h-full p-3">
          {/* Sidebar Header with Logo */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-auto flex items-center justify-center">
              <Image 
                src="/fanspark.png" 
                alt="FanSpark Logo" 
                width={160} 
                height={50}
                className="object-contain"
              />
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="mb-3 flex justify-center">
            <DynamicWalletButton />
          </div>

          {/* Dynamic Navigation */}
          <div className="flex-1 overflow-hidden">
            {isCampaignPage && currentCampaign ? (
              <CampaignSidebar 
                campaign={currentCampaign}
                activeItem={pathname}
              />
            ) : (
              <GlobalSidebar 
                activeItem={pathname}
              />
            )}
          </div>

          {/* Sidebar Footer with Theme Toggle */}
          <div className="mt-4 p-2 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-border/20">
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleTheme}
                className="h-7 w-7 p-0 hover:bg-accent/50 rounded-lg transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="h-3 w-3" />
                ) : (
                  <Moon className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-border/60 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center justify-center flex-1">
            <div className="h-10 w-auto flex items-center justify-center">
              <Image 
                src="/fanspark.png" 
                alt="FanSpark Logo" 
                width={100} 
                height={40}
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleTheme}
              className="h-8 w-8 p-0 hover:bg-accent/50 rounded-lg"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg border-border/30"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0 bg-background/95 shadow-2xl border-r border-border/60">
                <div className="flex flex-col h-full p-4">
                  {/* Mobile Sidebar Header */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-12 w-auto flex items-center justify-center">
                      <Image 
                        src="/fanspark.png" 
                        alt="FanSpark Logo" 
                        width={120} 
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Mobile Wallet Connection */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl border border-border/30 flex justify-center">
                    <NoSSR fallback={
                      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                    }>
                      <DynamicWidget />
                    </NoSSR>
                  </div>

                  {/* Mobile Donation Section */}
                  <div className="mb-6 flex justify-center">
                    <DonationModal />
                  </div>

                  {/* Mobile Campaigns List */}
                  <div className="flex-1 overflow-hidden">
            {isCampaignPage && currentCampaign ? (
              <CampaignSidebar 
                campaign={currentCampaign}
                activeItem={pathname}
                isMobile={true}
              />
            ) : (
              <GlobalSidebar 
                activeItem={pathname}
                isMobile={true}
              />
            )}
                  </div>

                  {/* Mobile Sidebar Footer */}
                  <div className="mt-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-border/20">
                    <div className="text-xs text-muted-foreground text-center">
                      <p className="font-medium">{CURRENT_NETWORK.displayName}</p>
                      <p className="text-[10px] opacity-70">{CURRENT_NETWORK.name}</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-96 lg:mr-8 transition-all duration-500 mt-5">
        {children}
      </main>

      {/* Footer */}
      <footer className="lg:ml-96 lg:mr-8 border-t py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Made with <Heart className="w-3 h-3 inline text-red-500 mx-1" /> by the FanSpark team · {currentYear}
          </p>
        </div>
      </footer>
    </div>
  );
} 