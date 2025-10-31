"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Wallet, 
  Wallet2, 
  Menu,
  X
} from "lucide-react";
import Image from 'next/image';

export default function Header({ 
  walletConnected, 
  address, 
  onConnectWallet, 
  onDisconnectWallet
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = () => {
    // You can make this dynamic based on your network detection
    return "Ethereum";
  };

  const navigationItems = [
    { href: "#mint", label: "Mint" },
    { href: "#about", label: "About" },
    { href: "#roadmap", label: "Roadmap" },
    { href: "#collection", label: "Collection" }
  ];

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-auto flex items-center justify-center">
                <Image 
                  src="/fanspark.png" 
                  alt="FanSpark Logo" 
                  width={80} 
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="border-t pt-4 space-y-3">
            {/* Network Status */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Network</span>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                {getNetworkName()}
              </Badge>
            </div>

            {/* Wallet Connection */}
            {walletConnected ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <Wallet2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-mono truncate">
                    {formatAddress(address)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={onDisconnectWallet}
                  className="w-full"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <Button
                onClick={onConnectWallet}
                className="w-full"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="h-8 w-auto flex items-center justify-center">
                <Image 
                  src="/fanspark.png" 
                  alt="FanSpark Logo" 
                  width={100} 
                  height={32}
                  className="object-contain"
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:bg-accent hover:text-accent-foreground group"
              >
                {item.label}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center space-x-2">
            {/* Network Badge - Desktop */}
            <div className="hidden sm:flex">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                {getNetworkName()}
              </Badge>
            </div>

            {/* Wallet Connection - Desktop */}
            {walletConnected ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/50">
                  <Wallet2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-mono">
                    {formatAddress(address)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDisconnectWallet}
                  className="rounded-full"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={onConnectWallet}
                className="hidden sm:flex items-center gap-2 rounded-full"
                size="sm"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-9 w-9 p-0 rounded-full"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">FS</span>
                      </div>
                      <span className="font-bold">FanSpark's</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Actions */}
                  <div className="border-t pt-4 space-y-3">
                    {/* Network Status */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <Badge variant="outline" className="text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        {getNetworkName()}
                      </Badge>
                    </div>

                    {/* Wallet Connection */}
                    {walletConnected ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                          <Wallet2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-mono truncate">
                            {formatAddress(address)}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={onDisconnectWallet}
                          className="w-full"
                        >
                          Disconnect Wallet
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={onConnectWallet}
                        className="w-full"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 