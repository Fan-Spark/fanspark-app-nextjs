"use client";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import NoSSR from "@/components/common/NoSSR";
 
export default function DynamicWalletButton() {
  return (
    <NoSSR fallback={
      <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
    }>
      <DynamicWidget />
    </NoSSR>
  );
} 