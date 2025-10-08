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
  activeItem = "campaigns",
  isMobile = false
}) {
  const router = useRouter();
  const pathname = usePathname();

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

  const handleCampaignChange = (campaign) => {
    // Navigate to the campaign href
    if (campaign.href) {
      router.push(campaign.href);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Collections Header */}
      {!isMobile && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-border/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-primary">Navigation</h2>
          </div>
          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm border-border/30">
            {globalNavigation.length}
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

      {/* Campaigns List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-1">
          {globalNavigation.map((campaign) => {
            const Icon = campaign.icon;
            const isActive = activeItem === campaign.id;
            
            return (
              <div key={campaign.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-auto p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10" 
                      : "hover:bg-accent/30 hover:border-accent/20 border border-transparent"
                  } ${
                    campaign.status === "coming-soon" ? "opacity-60" : ""
                  }`}
                  onClick={() => handleCampaignChange(campaign)}
                  disabled={campaign.status === "coming-soon"}
                >
                  <div className="flex items-center w-full">
                    <div className="relative mr-2">
                      {campaign.useImage ? (
                        <div className="relative">
                          <Image
                            src={campaign.image}
                            alt={campaign.name}
                            width={24}
                            height={24}
                            className={`h-6 w-6 object-cover rounded-md ${
                              isActive ? "ring-2 ring-primary shadow-lg" : "border border-border/30"
                            }`}
                          />
                          {isActive && (
                            <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-green-500 rounded-full border border-background animate-pulse"></div>
                          )}
                        </div>
                      ) : (
                        <div className={`h-6 w-6 rounded-md flex items-center justify-center ${
                          isActive 
                            ? `bg-gradient-to-br ${campaign.gradient} shadow-lg` 
                            : "bg-accent/20 border border-border/30"
                        }`}>
                          <Icon className={`h-3 w-3 ${
                            isActive ? "text-white" : getStatusColor(campaign.status)
                          }`} />
                        </div>
                      )}
                      {!campaign.useImage && isActive && (
                        <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-green-500 rounded-full border border-background animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium text-sm truncate ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}>
                          {campaign.name}
                        </span>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${
                        isActive ? "text-primary/70" : "text-muted-foreground"
                      }`}>
                        {campaign.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Campaigns Footer */}
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