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
  Package
} from "lucide-react";

export default function CampaignCard({ campaign }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewCampaign = () => {
    if (campaign.status === "coming-soon") {
      window.open(
        campaign.wordpressUrl || "https://www.fanspark.xyz/campaigns/coming-soon/gongora-the-sacred-trial-grounds-graphic-novel-volume-one-pre-launch/",
        "_blank"
      );
    } else {
      router.push(`/campaigns/${campaign.slug}`);
    }
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
  <Card className="group relative overflow-hidden bg-gradient-to-br from-background/50 to-background/30 border-0 dark:border dark:border-border/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
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
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                {campaign.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                {campaign.subtitle}
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {campaign.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {campaign.features.slice(0, 3).map((feature) => (
                <Badge 
                  key={feature} 
                  variant="secondary" 
                  className="text-xs bg-accent/50 text-accent-foreground/80"
                >
                  {feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
              {campaign.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{campaign.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Bottom Section - Button */}
          <div className="mt-6">
            {/* Action Button */}
            <Button 
              onClick={handleViewCampaign}
              className={`w-full font-medium transition-all duration-700 ease-in-out transform h-11 cursor-pointer
                bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-400 ease-in-out
              `}
            >
              <span className="flex items-center justify-center transition-all duration-400 ease-in-out">
                {campaign.status === "coming-soon" ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 transition-all duration-400 ease-in-out" />
                    Coming Soon
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2 transition-all duration-400 ease-in-out" />
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
