"use client";

import { useState, useEffect } from "react";
import { useDynamicWallet } from '@/hooks/useDynamicWallet';
import CampaignCard from "@/components/campaigns/CampaignCard";
import { getAllCampaigns } from "@/data/campaigns";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function Home() {
  const { isConnected, openConnectionModal } = useDynamicWallet();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Get all campaigns
    const allCampaigns = getAllCampaigns();
    setCampaigns(allCampaigns);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background mb-5">
        <div className="container mx-auto px-4">
          {/* Hero Section - Banner */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border/50 mb-12">
            <img 
              src="/dynamic-homepage-banner-01.png" 
              alt="Campaign Banner" 
              className="w-full h-auto object-contain"
            />
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
