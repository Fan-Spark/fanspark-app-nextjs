"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { globalNavigation } from "@/data/globalSystems";
import { ArrowUpRight } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* FanSpark Season 1 Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-12 shadow-2xl bg-gradient-to-br from-[#08242C] via-[#111] to-[#FEEB01]">
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(circle at top, #FEEB01, transparent 55%)" }}
          />
          <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-repeat" />
          <div className="relative flex flex-col lg:flex-row min-h-[340px]">
            {/* Left Content */}
            <div className="order-2 lg:order-1 flex-1 px-6 py-5 md:px-10 lg:px-12 text-white space-y-3">
              <p className="text-xs tracking-[0.3em] text-white/70">FANSPARK</p>
              <h1 className="text-3xl md:text-5xl font-bold uppercase leading-tight tracking-tight">
                Season 1<br />Digital Sticker Packs
              </h1>
              <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl">
                Collect, trade, and unlock the story! Grab FanSpark Season 1 digital sticker packs and start building your collection.
                Complete the full set to unlock super rare exclusives, behind-the-scenes access, and surprise rewards made for true fans.
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
            <div className="order-1 lg:order-2 flex-1 flex items-center justify-center p-5 sm:p-7">
              <div className="relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[200px] rotate-3 drop-shadow-2xl overflow-visible">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-white/15 via-transparent to-black/30 blur-3xl opacity-70" />
                <Image
                  src="/fs-season-one-pack-00.webp"
                  alt="FanSpark Season 1 Sticker Pack"
                  width={320}
                  height={320}
                  className="relative w-full h-auto object-contain"
                  priority
                />
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
