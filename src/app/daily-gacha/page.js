"use client";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import ComingSoonPage from "@/components/common/ComingSoonPage";

export default function DailyGachaPage() {
  return (
    <ErrorBoundary>
      <ComingSoonPage 
        title="Daily Gacha System"
        description="Platform-wide gacha rewards coming soon! Get ready for daily rewards and exciting prizes."
        icon="Dice6"
      />
    </ErrorBoundary>
  );
}
