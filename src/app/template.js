'use client';

import { useState, useEffect } from "react";
import { useDynamicWallet } from '@/hooks/useDynamicWallet';

import { usePathname } from "next/navigation";
import { CURRENT_NETWORK } from '@/utils/networkConfig';
import Sidebar from '@/components/common/Sidebar';
import DonationModal from '@/components/common/DonationModal';
import NoSSR from '@/components/common/NoSSR';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { 
  Wallet, 
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
  const pathname = usePathname();

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
          <div className="flex items-center justify-center py-6 mb-2">
            <div className="h-12 w-auto flex items-center justify-center">
              <Image 
                src="/fanspark.png" 
                alt="FanSpark Logo" 
                width={210} 
                height={210}
                className="object-contain"
                style={{ width: "auto", height: "100%" }}
              />
            </div>
          </div>

          {/* Unified Navigation */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Sidebar 
              activeItem={pathname}
            />
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
                style={{ width: "auto", height: "100%" }}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
                        style={{ width: "auto", height: "100%" }}
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

                  {/* Mobile Navigation List */}
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <Sidebar 
                      activeItem={pathname}
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
      <main className="lg:ml-96 lg:mr-8 transition-all duration-500 mt-5">
        {children}
      </main>

      {/* Footer */}
      <footer className="lg:ml-96 lg:mr-8 border-t border-border/50 py-6 mt-16">
      
        <div className="container mx-auto px-4">
           {/* Original "Made with Heart" line */}
          
          <div className="space-y-4">
          <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Made with <Heart className="w-3 h-3 inline text-red-500 mx-1" /> by the FanSpark team · {currentYear}
              </p>
            </div>
            {/* Copyright and Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <span>© {currentYear} Super Nifty Megacorp. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <a 
                href="https://fanspark.xyz/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#f0eb01] transition-colors"
              >
                Privacy Policy
              </a>
              <span className="hidden sm:inline">|</span>
              <a 
                href="https://www.fanspark.xyz/cookie-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#f0eb01] transition-colors"
              >
                Cookie Policy
              </a>
              <span className="hidden sm:inline">|</span>
              <a 
                href="https://www.fanspark.xyz/terms-of-use/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#f0eb01] transition-colors"
              >
                Terms of Use
              </a>
              <span className="hidden sm:inline">|</span>
              <a 
                href="https://www.fanspark.xyz/community-guidelines" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#f0eb01] transition-colors"
              >
                Community Guidelines
              </a>
            </div>
            
           
          </div>
        </div>
      </footer>
    </div>
  );
} 