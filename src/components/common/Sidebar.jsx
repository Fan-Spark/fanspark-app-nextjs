"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PortalLink from "@/components/common/PortalLink";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Package,
  StickyNote,
  Trophy,
  Star,
  Sparkles,
  Compass
} from "lucide-react";

export default function Sidebar({ 
  activeCollection = "reward-crate",
  onCollectionChange,
  isMobile = false
}) {
  const router = useRouter();
  
  const collections = [
    {
      id: "reward-crate",
      name: "Stellar Ardent",
      description: "Issue #1 Comic Book",
      icon: Package,
      image: "/reward-crate.png",
      useImage: true,
      status: "active",
      href: "/",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "sticker-collection",
      name: "Stickers",
      description: "Collect All to Earn Rewards",
      icon: StickyNote,
      status: "coming-soon",
      href: "#sticker-collection",
      gradient: "from-green-500 to-teal-600"
    },
    {
      id: "featured-fs",
      name: "Featured Collectibles",
      description: "Grab it before it's gone!",
      icon: Star,
      status: "coming-soon",
      href: "#featured-fs",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      id: "explore-campaigns",
      name: "Explore other Campaigns",
      description: "Check them out now!",
      icon: Compass,
      status: "coming-soon",
      href: "#explore-campaigns",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm">
            Testing
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm border-border/30">
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
        return "text-green-600";
      case "coming-soon":
        return "text-muted-foreground/60";
      default:
        return "text-muted-foreground/60";
    }
  };

  const handleCollectionChange = (collection) => {
    // If it's the reward crate, navigate to home page
    if (collection.id === "reward-crate") {
      router.push("/");
      return;
    }
    
    // For other collections, use the existing collection change handler
    onCollectionChange(collection.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Collections Header */}
      {!isMobile && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-border/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-primary">Campaign Items</h2>
          </div>
          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm border-border/30">
            {collections.length}
          </Badge>
        </div>
      )}

      {/* Mobile Testing Indicator */}
      {isMobile && (
        <div className="mb-4 p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-border/20">
          <div className="flex items-center justify-center">
            <div className="relative inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-pulse"></div>
              <div className="relative flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></div>
                <span className="text-[10px] font-medium text-cyan-300 tracking-wider">BETA TESTING</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collections List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-1">
          {collections.map((collection) => {
            const Icon = collection.icon;
            const isActive = activeCollection === collection.id;
            
            return (
              <div key={collection.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-auto p-3 rounded-xl transition-all duration-300 px-3 ${
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10" 
                      : "hover:bg-accent/30 hover:border-accent/20 border border-transparent"
                  } ${
                    collection.status === "coming-soon" ? "opacity-60" : ""
                  }`}
                  onClick={() => handleCollectionChange(collection)}
                  disabled={collection.status === "coming-soon"}
                >
                  <div className="flex items-center w-full">
                    <div className="relative mr-3">
                      {collection.useImage ? (
                        <div className="relative">
                          <Image
                            src={collection.image}
                            alt={collection.name}
                            width={32}
                            height={32}
                            className={`h-8 w-8 object-cover rounded-lg ${
                              isActive ? "ring-2 ring-primary shadow-lg" : "border border-border/30"
                            }`}
                          />
                          {isActive && (
                            <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full border border-background animate-pulse"></div>
                          )}
                        </div>
                      ) : (
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          isActive 
                            ? `bg-gradient-to-br ${collection.gradient} shadow-lg` 
                            : "bg-accent/20 border border-border/30"
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isActive ? "text-white" : getStatusColor(collection.status)
                          }`} />
                        </div>
                      )}
                      {!collection.useImage && isActive && (
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full border border-background animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}>
                          {collection.name}
                        </span>
                        {getStatusBadge(collection.status)}
                      </div>
                      <p className={`text-xs mt-1 ${
                        isActive ? "text-primary/70" : "text-muted-foreground"
                      }`}>
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Collections Footer */}
      {!isMobile && (
        <div className="mt-4 p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-border/20">
          <div className="space-y-3">
            {/* Testing Indicator */}
            <div className="flex items-center justify-center">
              <div className="relative inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
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