"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Sparkles,
  CheckCircle
} from "lucide-react";

export default function DynamicConnectButton({ 
  variant = "default", 
  size = "default", 
  className = "",
  showSupportedWallets = false 
}) {
  const { 
    handleConnect, 
    isConnecting, 
    isLoggedIn,
    user 
  } = useDynamicContext();

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-600">Connected</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleConnect} 
        disabled={isConnecting}
        variant={variant}
        size={size}
        className={`bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg ${className}`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      
      {showSupportedWallets && (
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>Supported wallets:</p>
          <div className="flex flex-wrap justify-center gap-1">
            <Badge variant="outline" className="text-xs">MetaMask</Badge>
            <Badge variant="outline" className="text-xs">WalletConnect</Badge>
            <Badge variant="outline" className="text-xs">Coinbase</Badge>
            <Badge variant="outline" className="text-xs">Rainbow</Badge>
          </div>
        </div>
      )}
    </div>
  );
} 