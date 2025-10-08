"use client";

import { useState, useEffect } from "react";
import { useDynamicWallet } from '@/hooks/useDynamicWallet';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wallet } from "lucide-react";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { getAllCampaigns } from "@/data/campaigns";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function Home() {
  const { isConnected, openConnectionModal } = useDynamicWallet();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Get all campaigns and limit to 3
    const allCampaigns = getAllCampaigns();
    setCampaigns(allCampaigns.slice(0, 3));
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background mb-5">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border/50 bg-gradient-to-br from-accent/10 to-accent/5 mb-12">
            {/* Grid background pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            
            <div className="relative container mx-auto px-6 py-16 text-center">
              <div className="max-w-4xl mx-auto">
                <Badge variant="outline" className="mb-6 text-sm bg-background/50 backdrop-blur-sm border-border/30">
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  Verified on-chain authenticity
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8">
                  Spark This Story Today!
                </h1>
                
                <p className="text-md text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
                  Get exclusive access to digital collectibles, in-game items, and special rewards within the FanSpark ecosystem of creators. Each tier contains core and bonus rewards from a different universe that's claimable at the end of the campaign.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg px-8 py-3 text-lg font-semibold"
                    onClick={openConnectionModal}
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect to Start
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Join our growing community of collectors in the FanSpark ecosystem
                </p>
              </div>
            </div>
          </div>

          {/* Available Campaigns Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Available Campaigns</h2>
            </div>
            
            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
