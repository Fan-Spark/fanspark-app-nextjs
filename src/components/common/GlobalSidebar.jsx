"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { globalNavigation } from "@/data/globalSystems";
import { 
  Sparkles
} from "lucide-react";

export default function GlobalSidebar({ 
  activeItem = "collections",
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
    
    // Navigate to the item
    router.push(item.href);
  };

  const isActiveItem = (item) => {
    if (item.href === '/' && pathname === '/') return true;
    if (item.href !== '/' && pathname.startsWith(item.href)) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Global Navigation Header */}
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

      {/* Global Navigation List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-1">
          {globalNavigation.map((item) => {
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
                          isActive ? "text-white" : getStatusColor(item.status)
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
                        {getStatusBadge(item.status)}
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
    </div>
  );
}
