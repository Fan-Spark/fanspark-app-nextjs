"use client";

import DynamicPortal from '@/components/common/DynamicPortal';

export default function PortalClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            User Portal
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Manage your profile, wallet settings, and account preferences
          </p>
          <p className="text-sm text-muted-foreground">
            Connect your wallet below to access your Dynamic.xyz profile and settings
          </p>
        </div>
        
        <DynamicPortal />
      </div>
    </div>
  );
}