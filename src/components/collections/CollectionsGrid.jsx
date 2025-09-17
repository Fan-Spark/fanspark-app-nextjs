"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CollectionCard from "./CollectionCard";
import { getAllCollections, getActiveCollections } from "@/data/collections";
import { 
  Sparkles,
  Clock,
  TrendingUp,
  Grid3X3
} from "lucide-react";

export default function CollectionsGrid() {
  const [filter, setFilter] = useState("all");
  
  const allCollections = getAllCollections();
  const activeCollections = getActiveCollections();
  const comingSoonCollections = allCollections.filter(c => c.status === "coming-soon");

  const getFilteredCollections = () => {
    switch (filter) {
      case "active":
        return activeCollections;
      case "coming-soon":
        return comingSoonCollections;
      default:
        return allCollections;
    }
  };

  const filteredCollections = getFilteredCollections();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary">FanSpark Collections</span>
        </div>
        
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-3">
            Discover Amazing Collections
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore unique digital collections, each with their own campaigns, games, and rewards. 
            Join the community and start your collection journey today.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Grid3X3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{allCollections.length}</p>
              <p className="text-sm text-muted-foreground">Total Collections</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCollections.length}</p>
              <p className="text-sm text-muted-foreground">Active Now</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{comingSoonCollections.length}</p>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 lg:mx-auto">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>All Collections</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {allCollections.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <span>Active</span>
            <Badge variant="secondary" className="ml-1 text-xs bg-green-500/20 text-green-700">
              {activeCollections.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="coming-soon" className="flex items-center space-x-2">
            <span>Coming Soon</span>
            <Badge variant="secondary" className="ml-1 text-xs bg-orange-500/20 text-orange-700">
              {comingSoonCollections.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredCollections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Grid3X3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Collections Found</h3>
              <p className="text-muted-foreground">
                {filter === "active" && "No active collections available at the moment."}
                {filter === "coming-soon" && "No upcoming collections scheduled."}
                {filter === "all" && "No collections available."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
