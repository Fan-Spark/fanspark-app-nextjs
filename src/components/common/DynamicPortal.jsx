"use client";

import { DynamicEmbeddedWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export default function DynamicPortal() {
  const { user, isLoggedIn } = useDynamicContext();

  if (!isLoggedIn || !user) {
    return <DynamicEmbeddedWidget background="default" />;
  }

  // If user is logged in, you can show other profile information here
  // For now, we will show the same embedded widget which will now show the user profile
  return <DynamicEmbeddedWidget background="default" />;
} 