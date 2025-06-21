"use client";

import { useDynamicWallet } from '@/hooks/useDynamicWallet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet,
  User,
  Shield,
  Activity,
  ExternalLink,
  Copy,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function DynamicDemo() {
  const { 
    isConnected, 
    isConnecting, 
    walletAddress, 
    network,
    user,
    primaryWallet,
    connect,
    disconnect,
    walletConnectorError
  } = useDynamicWallet();
  
  const [copied, setCopied] = useState(false);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
          Dynamic.xyz Integration Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          Experience enhanced wallet authentication and user management
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Current connection status and wallet information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          {isConnected && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {formatAddress(walletAddress)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(walletAddress)}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Network</p>
                  <Badge variant="outline" className="mt-1">
                    {network?.name || "Unknown"}
                  </Badge>
                </div>
              </div>
            </>
          )}
          
          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={connect} 
                disabled={isConnecting}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={disconnect}
                className="flex-1"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      {isConnected && user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Profile
            </CardTitle>
            <CardDescription>
              Dynamic.xyz user profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="font-medium">{user.username || "Anonymous"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
            </div>
            
            {user.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wallet Details */}
      {isConnected && primaryWallet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Wallet Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wallet Type</p>
                <p className="font-medium">{primaryWallet.connector?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chain</p>
                <Badge variant="outline">
                  {primaryWallet.chain || "Unknown"}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`https://basescan.org/address/${walletAddress}`, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on BaseScan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {walletConnectorError && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Activity className="w-5 h-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              {walletConnectorError.message || "An error occurred while connecting"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Dynamic.xyz Features
          </CardTitle>
          <CardDescription>
            What makes this integration special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Wallet Support</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• MetaMask</li>
                <li>• WalletConnect</li>
                <li>• Coinbase Wallet</li>
                <li>• Rainbow</li>
                <li>• And many more...</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">User Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Persistent sessions</li>
                <li>• User profiles</li>
                <li>• Multi-chain support</li>
                <li>• Enhanced security</li>
                <li>• Analytics & insights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 