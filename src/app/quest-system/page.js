"use client";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import ComingSoonPage from "@/components/common/ComingSoonPage";

export default function QuestSystemPage() {
  return (
    <ErrorBoundary>
      <ComingSoonPage 
        title="Quest System"
        description="Platform-wide mission system coming soon! Complete quests across all collections and unlock exclusive rewards."
        icon="Trophy"
      />
    </ErrorBoundary>
  );
}
