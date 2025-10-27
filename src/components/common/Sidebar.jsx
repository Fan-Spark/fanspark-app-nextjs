"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PortalLink from "@/components/common/PortalLink";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { globalNavigation } from "@/data/globalSystems";
import { 
  Sparkles
} from "lucide-react";

export default function Sidebar({ 
  activeItem,
  isMobile = false
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="text-[10px] bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm px-1.5 py-0.5">
            Active
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge variant="outline" className="text-[10px] bg-background/50 backdrop-blur-sm border-border/30 px-1.5 py-0.5">
            Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "coming-soon":
        return "text-muted-foreground/60 dark:text-muted-foreground/60";
      default:
        return "text-muted-foreground/60 dark:text-muted-foreground/60";
    }
  };

  const handleNavigation = (item) => {
    if (item.status === "coming-soon") return;
    
    // Navigate to the item
    router.push(item.href);
  };

  const isActiveItem = (item) => {
    // Check if this is the active item based on pathname
    if (item.href === '/' && pathname === '/') return true;
    if (item.href !== '/' && pathname.startsWith(item.href)) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Header */}
      {!isMobile && (
        <div className="flex items-center justify-between mb-0.5 p-0.5 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-border/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-[12px] font-semibold text-primary">Navigation</h2>
          </div>
          <Badge variant="outline" className="text-[10px] bg-background/50 backdrop-blur-sm border-border/30 px-1.5 py-0">
            {globalNavigation.length}
          </Badge>
        </div>
      )}

      {/* Mobile Testing Indicator */}
      {isMobile && (
        <div className="mb-2 p-2 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-border/20">
          <div className="flex items-center justify-center">
            <div className="relative inline-flex items-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-pulse"></div>
              <div className="relative flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></div>
                <span className="text-[10px] font-medium text-cyan-300 tracking-wider">BETA TESTING</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <ScrollArea className="flex-1 pr-1">
        <div className="space-y-0 p-1">
          {globalNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);
            
            return (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-auto p-2 rounded-md transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10" 
                      : "hover:bg-accent/30 hover:border-accent/20 border border-transparent"
                  } ${item.status === "coming-soon" ? "opacity-60" : ""}`}
                  onClick={() => handleNavigation(item)}
                  disabled={item.status === "coming-soon"}
                >
                  <div className="flex items-center w-full">
                    <div className="relative mr-2">
                      {item.useImage ? (
                        <div className="relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={20}
                            height={20}
                            className={`h-5 w-5 object-cover rounded-md ${
                              isActive ? "ring-2 ring-primary shadow-lg" : "border border-border/30"
                            }`}
                          />
                          {isActive && (
                            <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-green-500 rounded-full border border-background animate-pulse"></div>
                          )}
                        </div>
                      ) : (
                        <div className={`h-5 w-5 rounded-md flex items-center justify-center ${
                          isActive
                            ? (item.gradient ? `bg-gradient-to-br ${item.gradient} shadow-lg` : "shadow-lg")
                            : item.status === "coming-soon"
                              ? (item.gradient ? `bg-gradient-to-br ${item.gradient} opacity-80` : "bg-accent/20 border border-border/30")
                              : "bg-accent/20 border border-border/30"
                        }`}>
                          <Icon className={`h-3 w-3 ${
                            isActive 
                              ? "text-green-500" 
                              : item.status === "coming-soon"
                                ? "text-muted-foreground"
                                : getStatusColor(item.status)
                          }`} />
                        </div>
                      )}
                      {!item.useImage && isActive && (
                        <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-green-500 rounded-full border border-background animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-[12px] font-medium truncate ${
                            isActive ? "text-primary" : "text-foreground"
                          }`}>
                            {item.name}
                          </p>
                          <p className="text-[10px] leading-tight text-muted-foreground truncate mt-0">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center h-full pt-1">
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Navigation Footer */}
      {!isMobile && (
        <div className="mt-2 p-1.5 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-border/20">
          <div className="space-y-3">
            {/* Social Media Icons */}
            <div className="flex items-center justify-center gap-2">
              <a 
                href="https://x.com/fansparkxyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-accent/30 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              <a 
                href="https://discord.com/invite/FKgJcYJjQM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-accent/30 transition-colors"
                aria-label="Discord"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.linkedin.com/company/fansparkxyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-accent/30 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.facebook.com/fansparkxyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-accent/30 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            
            <Separator className="bg-border/30" />
            
            {/* Testing Indicator */}
            <div className="flex items-center justify-center">
              <div className="relative inline-flex items-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-pulse"></div>
                <div className="relative flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></div>
                  <span className="text-[10px] font-medium text-cyan-300 tracking-wider">BETA TESTING</span>
                </div>
              </div>
            </div>
            
            <Separator className="bg-border/30" />
            <PortalLink 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
} 