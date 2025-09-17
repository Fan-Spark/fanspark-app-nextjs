"use client";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import ComingSoonPage from "@/components/common/ComingSoonPage";

export default function BatteryGamePage() {
  return (
    <ErrorBoundary>
      <ComingSoonPage 
        title="Battery Game"
        description="Global energy management system coming soon! Manage your energy across all collections and earn rewards."
        icon="Battery"
      />
    </ErrorBoundary>
  );
}
