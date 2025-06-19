'use client';

import { useState } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useTheme } from '@/components/common/ThemeProvider';
import Sidebar from '@/components/common/Sidebar';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Moon, 
  Sun,
  Menu,
  Sparkles
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Template({ children }) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const [activeCollection, setActiveCollection] = useState("reward-crate");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleConnectWallet = () => {
    connect();
  };

  const handleDisconnectWallet = () => {
    disconnect({ label: wallet.label });
  };

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Floating Sidebar */}
      <div className="fixed left-6 top-6 h-[calc(100vh-3rem)] w-80 bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl transition-all duration-500 z-50 hidden lg:block">
        <div className="flex flex-col h-full p-4">
          {/* Sidebar Header with Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">SSD</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Super Space Defenders
                </h1>
                <p className="text-xs text-muted-foreground font-medium">NFT Collections</p>
              </div>
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl border border-border/30">
            {wallet ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-600">Connected</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm">
                    {connectedChain?.label || "Unknown Network"}
                  </Badge>
                </div>
                <div className="p-2 bg-background/50 rounded-lg border border-border/20">
                  <p className="text-xs text-muted-foreground font-mono text-center">
                    {formatAddress(wallet.accounts[0]?.address)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnectWallet}
                  className="w-full hover:bg-destructive/10 hover:text-destructive border-border/30"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Connect Wallet</span>
                </div>
                <Button
                  onClick={handleConnectWallet}
                  disabled={connecting}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                >
                  {connecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            )}
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
                <p className="font-medium">Base Network</p>
                <p className="text-[10px] opacity-70">Layer 2 Solution</p>
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
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SSD</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Super Space Defenders
              </h1>
              <p className="text-xs text-muted-foreground font-medium">NFT Collections</p>
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xl">SSD</span>
                        </div>
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                          Collections
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Wallet Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl border border-border/30">
                    {wallet ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-green-600">Connected</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm">
                            {connectedChain?.label || "Unknown Network"}
                          </Badge>
                        </div>
                        <div className="p-2 bg-background/50 rounded-lg border border-border/20">
                          <p className="text-xs text-muted-foreground font-mono text-center">
                            {formatAddress(wallet.accounts[0]?.address)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisconnectWallet}
                          className="w-full hover:bg-destructive/10 hover:text-destructive border-border/30"
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">Connect Wallet</span>
                        </div>
                        <Button
                          onClick={handleConnectWallet}
                          disabled={connecting}
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                        >
                          {connecting ? "Connecting..." : "Connect Wallet"}
                        </Button>
                      </div>
                    )}
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
                      <p className="font-medium">Base Network</p>
                      <p className="text-[10px] opacity-70">Layer 2 Solution</p>
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