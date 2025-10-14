"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background mb-5">
      <div className="container mx-auto px-4">
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border/50 bg-gradient-to-br from-accent/10 to-accent/5 mb-6">
          <div className="relative container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-6 w-48 mx-auto" />
              <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
              <Skeleton className="h-6 w-full max-w-xl mx-auto" />
              <div className="flex justify-center gap-3 mt-8">
                <Skeleton className="h-11 w-40" />
                <Skeleton className="h-11 w-40" />
              </div>
            </div>
          </div>
          {/* Progress Bar Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <div className="container mx-auto">
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-border/50 mb-6" />

        {/* Tokens Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-6 lg:pr-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

