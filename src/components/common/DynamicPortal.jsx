"use client";

import { DynamicEmbeddedWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import NoSSR from "@/components/common/NoSSR";
import { useState, useEffect } from "react";

function DynamicPortalContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    );
  }

  try {
    const { user, isLoggedIn } = useDynamicContext();

    if (!isLoggedIn || !user) {
      return <DynamicEmbeddedWidget background="default" />;
    }

    // If user is logged in, you can show other profile information here
    // For now, we will show the same embedded widget which will now show the user profile
    return <DynamicEmbeddedWidget background="default" />;
  } catch (error) {
    console.error("Error in DynamicPortal:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load portal</p>
          <p className="text-sm text-muted-foreground mt-2">Please refresh the page</p>
        </div>
      </div>
    );
  }
}

export default function DynamicPortal() {
  return (
    <NoSSR fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    }>
      <DynamicPortalContent />
    </NoSSR>
  );
} 