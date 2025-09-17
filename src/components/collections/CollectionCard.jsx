"use client";

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

export default function CollectionCard({ collection }) {
  const router = useRouter();

  const handleViewCollection = () => {
    router.push(`/collections/${collection.slug}`);
  };

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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-background/50 to-background/30 border-0 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Collection Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge - Top Right */}
          <div className="absolute top-3 right-3">
            {getStatusBadge(collection.status)}
          </div>
          
          {/* Stats Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Package className="w-3 h-3" />
                  <span className="text-xs font-medium">{collection.totalItems} Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Info */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                {collection.subtitle}
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {collection.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {collection.features.slice(0, 3).map((feature) => (
                <Badge 
                  key={feature} 
                  variant="secondary" 
                  className="text-xs bg-accent/50 text-accent-foreground/80"
                >
                  {feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
              {collection.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{collection.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Bottom Section - Button */}
          <div className="mt-6">
            {/* Action Button */}
            <Button 
              onClick={handleViewCollection}
              className="w-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 h-11"
              disabled={collection.status === "coming-soon"}
            >
              {collection.status === "coming-soon" ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Coming Soon
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Explore Collection
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
