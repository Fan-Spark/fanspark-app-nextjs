"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { 
  Sparkles,
  ArrowLeft
} from "lucide-react";

export default function CampaignSidebar({ 
  campaign,
  activeItem,
  isMobile = false
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30 font-medium">
            Active
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/30 font-medium">
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
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  const handleNavigation = (item) => {
    if (item.status === "coming-soon") return;
    
    const url = `/campaigns/${campaign.slug}${item.path}`;
    router.push(url);
  };

  const handleBackToCampaigns = () => {
    router.push('/');
  };

  const isActiveItem = (item) => {
    const itemPath = `/campaigns/${campaign.slug}${item.path}`;
    if (item.path === '/campaigns' && pathname === `/campaigns/${campaign.slug}`) return true;
    return pathname === itemPath;
  };

  if (!campaign) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Campaign Header */}
      {!isMobile && (
        <div className="mb-4 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-border/20">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-primary truncate">{campaign.name}</h2>
          </div>
          <p className="text-xs text-muted-foreground">{campaign.subtitle}</p>
          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm border-border/30 mt-2">
            {campaign.navigation.length} Features
          </Badge>
        </div>
      )}

      {/* Mobile Campaign Info */}
      {isMobile && (
        <div className="mb-4 p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-border/20">
          <div className="text-center">
            <h3 className="font-semibold text-sm text-foreground">{campaign.name}</h3>
            <p className="text-xs text-muted-foreground">{campaign.subtitle}</p>
          </div>
        </div>
      )}

      {/* Campaign Navigation */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-1">
          {campaign.navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);
            
            return (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-auto p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10" 
                      : "hover:bg-accent/30 hover:border-accent/20 border border-transparent"
                  } ${
                    item.status === "coming-soon" ? "opacity-60" : ""
                  }`}
                  onClick={() => handleNavigation(item)}
                  disabled={item.status === "coming-soon"}
                >
                  <div className="flex items-center w-full">
                    <div className="relative mr-2">
                      <div className={`h-6 w-6 rounded-md flex items-center justify-center ${
                        isActive 
                          ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                          : "bg-accent/20 border border-border/30"
                      }`}>
                        <Icon className={`h-3 w-3 ${
                          isActive ? "text-white" : getStatusColor(item.status || "active")
                        }`} />
                      </div>
                      {isActive && (
                        <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-green-500 rounded-full border border-background animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-medium truncate ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}>
                          {item.name}
                        </p>
                        {getStatusBadge(item.status || "active")}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Back to Campaigns - Bottom Center */}
      <div className="mt-4 p-3 border-t border-border/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToCampaigns}
          className="w-full justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
    </div>
  );
}
