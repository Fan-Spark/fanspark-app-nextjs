"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Radio } from "lucide-react";

export default function SyncIndicator({ 
  pendingRefresh,
  onManualSync
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Always Live Status Badge with animated icon */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3 bg-green-500/10 border-green-500/30 hover:bg-green-500/10 cursor-default"
        disabled
      >
        <Radio className="w-3 h-3 mr-2 text-green-600 animate-pulse" />
        <span className="text-xs font-medium text-green-600">
          Live
        </span>
      </Button>

      {/* Manual Refresh Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onManualSync}
        disabled={pendingRefresh}
        className="h-8 w-8 p-0"
        title="Refresh data"
      >
        <RefreshCw className={`w-3 h-3 ${pendingRefresh ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
} 