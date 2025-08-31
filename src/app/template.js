'use client';

import { useState } from "react";
import { useDynamicWallet } from '@/hooks/useDynamicWallet';
import { useTheme } from '@/components/common/ThemeProvider';
import { CURRENT_NETWORK } from '@/utils/networkConfig';
import Sidebar from '@/components/common/Sidebar';
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
  User
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
  
  const [activeCollection, setActiveCollection] = useState("reward-crate");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Desktop Floating Sidebar */}
      <div className="fixed left-6 top-6 h-[calc(100vh-3rem)] w-80 bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl transition-all duration-500 z-50 hidden lg:block">
        <div className="flex flex-col h-full p-4">
          {/* Sidebar Header with Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-auto flex items-center justify-center">
              <Image 
                src="/fanspark.png" 
                alt="FanSpark Logo" 
                width={220} 
                height={68}
                className="object-contain"
              />
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="mb-4 flex justify-center">
            <DynamicWalletButton />
          </div>

          {/* Donation Section */}
          <div className="mb-6 flex justify-center">
            <DonationModal />
          </div>

          {/* Collections Navigation */}
          <div className="flex-1 overflow-hidden">
            <Sidebar 
              activeCollection={activeCollection}
              onCollectionChange={setActiveCollection}
            />
          </div>

          {/* Sidebar Footer with Theme Toggle */}
          <div className="mt-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-border/20">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">{CURRENT_NETWORK.displayName}</p>
                <p className="text-[10px] opacity-70">{CURRENT_NETWORK.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleTheme}
                className="h-8 w-8 p-0 hover:bg-accent/50 rounded-lg transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
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
            {/* Donation Button for Mobile */}
            <div className="hidden sm:block">
              <DonationModal />
            </div>
            
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

                  {/* Mobile Collections List */}
                  <div className="flex-1 overflow-hidden">
                    <Sidebar 
                      activeCollection={activeCollection}
                      onCollectionChange={setActiveCollection}
                      isMobile={true}
                    />
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
      <main className="lg:ml-96 lg:pt-6 pt-16 transition-all duration-500">
        {children}
      </main>
    </div>
  );
} 