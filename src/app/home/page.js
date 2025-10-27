"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { globalNavigation } from "@/data/globalSystems";
import { Sparkles, ArrowUpRight } from "lucide-react";
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

  // Filter out 'home' from navigation items
  const filteredNavigation = globalNavigation.filter(item => item.id !== 'home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* FanSpark Season 1 Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-12 shadow-2xl" style={{ backgroundColor: '#eae74a' }}>
          {/* Diagonal Split Layout */}
          <div className="relative min-h-[550px] md:min-h-[600px] overflow-hidden">
            {/* Left Section - Dark Black Background with Text */}
            <div className="absolute inset-0" style={{ backgroundColor: '#1a1a1a' }}>
              <div className="absolute inset-0" style={{
                clipPath: 'polygon(0 0, 67% 0, 37% 100%, 0 100%)'
              }} />
            </div>

            

        

            {/* Decorative Lines - Right Side */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-black/10" style={{
              clipPath: 'polygon(67% 0, 100% 0, 100% 100%, 37% 100%)'
            }} />
            <div className="absolute right-4 top-0 bottom-0 w-px bg-black/5" style={{
              clipPath: 'polygon(67% 0, 100% 0, 100% 100%, 37% 100%)'
            }} />

            {/* Diagonal Separator Line */}
            <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 via-white/10 to-transparent" style={{
              left: '67%',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            }} />
            <div className="absolute top-0 bottom-0 w-px bg-black/20" style={{
              left: '67%'
            }} />

            {/* Content Container */}
            <div className="relative z-10 flex items-center h-full min-h-[550px] md:min-h-[600px]">
              {/* Left Content */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-6 md:px-8 lg:px-12 py-12" style={{ width: '60%' }}>
                <p className="text-sm text-white/70 mb-3 font-medium">FANSPARK</p>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase leading-tight tracking-tight">
                  Season 1<br />Digital Sticker Packs
                </h1>
                <p className="text-white text-sm md:text-base mb-8 leading-relaxed max-w-xl">
                  Collect, trade, and unlock the story! Grab FanSpark Season 1 digital sticker packs and start building your collection. Complete the full set to unlock super rare exclusive stickers and gain access to Season 1 projects, behind-the-scenes content, and surprise rewards you won't find anywhere else. Only for true fans—start your collection today!
                </p>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 max-w-fit text-sm px-6 h-11"
                  disabled
                >
                  COMING SOON
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Right Content - Image */}
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-8 md:px-12" style={{ width: '40%' }}>
                <div className="relative max-w-sm w-full transform rotate-3">
                  <Image
                    src="/fs-season-one-pack-00.webp"
                    alt="FanSpark Season 1 Sticker Pack"
                    width={600}
                    height={600}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">Explore FanSpark</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.status === "coming-soon";
              
              return (
                <Card 
                  key={item.id}
                  className={`group relative overflow-hidden border-0 transition-all duration-300 cursor-pointer ${
                    isDisabled 
                      ? "opacity-60" 
                      : "hover:shadow-xl hover:shadow-primary/10"
                  }`}
                  style={{ backgroundColor: '#171717' }}
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
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
