"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DynamicTest() {
  const { 
    handleConnect, 
    handleDisconnect, 
    user, 
    primaryWallet, 
    isConnecting,
    isLoggedIn 
  } = useDynamicContext();

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Dynamic.xyz Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Status:</p>
          <p className="font-medium">{isLoggedIn ? "Connected" : "Disconnected"}</p>
        </div>
        
        {isLoggedIn && primaryWallet && (
          <div>
            <p className="text-sm text-muted-foreground">Address:</p>
            <p className="font-mono text-sm">{formatAddress(primaryWallet.address)}</p>
          </div>
        )}
        
        <div className="space-y-2">
          {!isLoggedIn ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              Disconnect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 