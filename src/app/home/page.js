"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { globalNavigation } from "@/data/globalSystems";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (item) => {
    if (item.status === "coming-soon") return;
    router.push(item.href);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm px-2 py-1">
            Active
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm border-border/30 px-2 py-1">
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to FanSpark
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore all the features and campaigns available in the FanSpark ecosystem
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalNavigation.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.status === "coming-soon";
            
            return (
              <Card 
                key={item.id}
                className={`group relative overflow-hidden border transition-all duration-300 cursor-pointer ${
                  isDisabled 
                    ? "opacity-60 border-border/30" 
                    : "border-border/30 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                }`}
                onClick={() => handleNavigation(item)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      isDisabled 
                        ? "bg-muted" 
                        : "bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20"
                    } transition-colors`}>
                      <Icon className={`h-6 w-6 ${
                        isDisabled ? "text-muted-foreground" : "text-primary"
                      }`} />
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                {item.id === 'home' && (
                  <CardContent>
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src="/fanspark.png"
                        alt="FanSpark"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
