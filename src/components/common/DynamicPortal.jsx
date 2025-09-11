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

  // Move the hook call outside of try-catch to ensure it's always called
  let user, isLoggedIn;
  try {
    const context = useDynamicContext();
    user = context.user;
    isLoggedIn = context.isLoggedIn;
  } catch (error) {
    console.error("Error accessing Dynamic context:", error);
    user = null;
    isLoggedIn = false;
  }

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

  if (!isLoggedIn || !user) {
    return <DynamicEmbeddedWidget background="default" />;
  }

  // If user is logged in, you can show other profile information here
  // For now, we will show the same embedded widget which will now show the user profile
  return <DynamicEmbeddedWidget background="default" />;
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