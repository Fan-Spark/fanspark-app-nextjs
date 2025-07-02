"use client";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import NoSSR from "@/components/common/NoSSR";
 
export default function DynamicMobileWallet() {
  return (
    <NoSSR fallback={
      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
    }>
      <DynamicWidget />
    </NoSSR>
  );
} 