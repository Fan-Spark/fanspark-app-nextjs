"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PortalLink from "@/components/common/PortalLink";
import { useRouter } from "next/navigation";
import { 
  Package,
  StickyNote,
  Trophy,
  Star,
  Sparkles
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
      name: "Reward Crate",
      description: "ERC1155 NFT Collection",
      icon: Package,
      status: "active",
      href: "/",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "sticker-collection",
      name: "Sticker Collection",
      description: "Coming Soon",
      icon: StickyNote,
      status: "coming-soon",
      href: "#sticker-collection",
      gradient: "from-green-500 to-teal-600"
    },
    {
      id: "chain-competition",
      name: "Chain Competition",
      description: "Soulbound Tokens",
      icon: Trophy,
      status: "coming-soon",
      href: "#chain-competition",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      id: "featured-fs",
      name: "Featured FS Collectibles",
      description: "Premium Collection",
      icon: Star,
      status: "coming-soon",
      href: "#featured-fs",
      gradient: "from-pink-500 to-rose-600"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm">
            Live
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
            <h2 className="text-sm font-semibold text-primary">Collections</h2>
          </div>
          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm border-border/30">
            {collections.length}
          </Badge>
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
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? `bg-gradient-to-br ${collection.gradient} shadow-lg` 
                          : "bg-accent/20 border border-border/30"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          isActive ? "text-white" : getStatusColor(collection.status)
                        }`} />
                      </div>
                      {isActive && (
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
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">More Collections</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Coming Soon</p>
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