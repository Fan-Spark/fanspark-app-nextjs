"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ExternalLink,
  Clock,
  Package,
  Loader2,
  Timer
} from "lucide-react";

export default function CampaignCard({ campaign }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewCampaign = () => {
    setIsNavigating(true);
    router.push(`/campaigns/${campaign.slug}`);
  };

  // No add-to-cart here; campaign cards navigate to View Collection

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 text-white border-0 font-medium shadow-lg">
            Active
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge className="bg-orange-500 text-white border-0 font-medium shadow-lg">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
  <Card className="group relative overflow-hidden border-0 dark:border dark:border-border/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col" style={{ backgroundColor: '#171717' }}>
      <CardContent className="p-0 flex flex-col h-full">
        {/* Campaign Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={campaign.image}
            alt={campaign.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge - Top Right */}
          <div className="absolute top-3 right-3">
            {getStatusBadge(campaign.status)}
          </div>
          
          {/* Stats Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Package className="w-3 h-3" />
                  <span className="text-xs font-medium">{campaign.totalItems} Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="px-6 pt-6 pb-4 flex flex-col flex-1">
          <div className="flex-1 space-y-3">
            {/* Creator */}
            {campaign.creator && (
              <p className="text-xs text-muted-foreground font-medium">
                {campaign.creator}
              </p>
            )}
            
            {/* Title */}
            <div>
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                {campaign.name}
              </h3>
            </div>
             {/* Remaining Time */}
             {campaign.remainingTime && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{campaign.remainingTime}</span>
              </div>
            )}
            
            {/* Description */}
            {campaign.description && (
              <p className="text-sm text-muted-foreground">
                {campaign.description}
              </p>
            )}
            
           
            
            {/* Product Type and Location */}
            <div className="flex flex-wrap gap-2">
              {campaign.productType && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-accent/50 text-accent-foreground/80"
                >
                  {campaign.productType}
                </Badge>
              )}
              {campaign.location && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-accent/50 text-accent-foreground/80"
                >
                  {campaign.location}
                </Badge>
              )}
            </div>
          </div>

          {/* Bottom Section - Button */}
          <div className="mt-4">
            {/* Action Button */}
            <Button 
              onClick={handleViewCampaign}
              size="lg"
              className={`w-full font-semibold transition-all duration-700 ease-in-out transform cursor-pointer text-base shadow-md
                ${campaign.status === "coming-soon" 
                  ? "bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed transition-all duration-400 ease-in-out" 
                  : "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground group-hover:shadow-xl group-hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-400 ease-in-out"
                }`}
              disabled={campaign.status === "coming-soon" || isNavigating}
            >
              <span className="flex items-center justify-center transition-all duration-400 ease-in-out">
                {campaign.status === "coming-soon" ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 transition-all duration-400 ease-in-out" />
                    Coming Soon
                  </>
                ) : isNavigating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin transition-all duration-400 ease-in-out" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 mr-2 transition-all duration-400 ease-in-out" />
                    View Collection
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
