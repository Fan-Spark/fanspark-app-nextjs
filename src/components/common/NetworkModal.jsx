"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Wifi,
  WifiOff
} from "lucide-react";

export default function NetworkModal({ 
  isOpen, 
  onClose, 
  currentNetwork, 
  supportedNetworks,
  onSwitchNetwork 
}) {
  const isNetworkSupported = supportedNetworks.some(
    network => network.chainId === currentNetwork?.chainId
  );

  const getNetworkIcon = (network) => {
    // You can add network-specific icons here
    return <Wifi className="w-5 h-5" />;
  };

  const getNetworkStatus = (network) => {
    if (!currentNetwork) return 'disconnected';
    if (network.chainId === currentNetwork.chainId) return 'connected';
    return 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Network Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Network Status */}
          <div className="space-y-3">
            <h3 className="font-medium">Current Network</h3>
            {currentNetwork ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  {getNetworkIcon(currentNetwork)}
                  <div>
                    <div className="font-medium">{currentNetwork.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Chain ID: {currentNetwork.chainId}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isNetworkSupported ? (
                    <Badge variant="outline" className="text-green-500 border-green-500/20">
                      Supported
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-500/20">
                      Unsupported
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/50">
                <WifiOff className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-muted-foreground">No Network Connected</div>
                  <div className="text-sm text-muted-foreground">
                    Please connect your wallet
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning for unsupported network */}
          {currentNetwork && !isNetworkSupported && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                This network is not supported. Please switch to a supported network.
              </span>
            </div>
          )}

          <Separator />

          {/* Supported Networks */}
          <div className="space-y-3">
            <h3 className="font-medium">Supported Networks</h3>
            <div className="space-y-2">
              {supportedNetworks.map((network) => {
                const status = getNetworkStatus(network);
                
                return (
                  <div 
                    key={network.chainId}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getNetworkIcon(network)}
                      <div>
                        <div className="font-medium">{network.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Chain ID: {network.chainId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      
                      {status === 'connected' ? (
                        <Badge variant="outline" className="text-green-500 border-green-500/20">
                          Connected
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSwitchNetwork(network)}
                          disabled={status === 'connected'}
                        >
                          Switch
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network Explorer Links */}
          {currentNetwork && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium">Network Explorer</h3>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (currentNetwork.explorerUrl) {
                      window.open(currentNetwork.explorerUrl, '_blank');
                    }
                  }}
                  disabled={!currentNetwork.explorerUrl}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 