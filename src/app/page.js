"use client";

import HomeComponent from "@/components/home/HomeComponent";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function Home() {
  // Client-side only rendering
  return (
    <ErrorBoundary>
      <HomeComponent />
    </ErrorBoundary>
  );
}
