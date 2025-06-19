"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Zap,
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function BatchMintModal({ 
  isOpen, 
  onClose, 
  cart, 
  onBatchMint, 
  walletConnected,
  address 
}) {
  const [mintStatus, setMintStatus] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMintStatus({});
      setCurrentStep(0);
      setTotalSteps(cart.length);
      setError(null);
    }
  }, [isOpen, cart]);

  const handleBatchMint = async () => {
    if (!walletConnected || cart.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Initialize status for all items
      const initialStatus = {};
      cart.forEach(item => {
        initialStatus[item.tokenId] = { status: 'pending', message: 'Waiting...' };
      });
      setMintStatus(initialStatus);

      // Process each item in the cart
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        setCurrentStep(i + 1);
        
        try {
          // Update status to processing
          setMintStatus(prev => ({
            ...prev,
            [item.tokenId]: { status: 'processing', message: 'Minting...' }
          }));

          // Call the mint function
          await onBatchMint(item.tokenId, item.quantity, item.useWhitelist);
          
          // Update status to success
          setMintStatus(prev => ({
            ...prev,
            [item.tokenId]: { status: 'success', message: 'Minted successfully!' }
          }));
          
        } catch (error) {
          console.error(`Error minting token ${item.tokenId}:`, error);
          
          // Update status to error
          setMintStatus(prev => ({
            ...prev,
            [item.tokenId]: { 
              status: 'error', 
              message: error.message || 'Minting failed' 
            }
          }));
        }
      }
      
    } catch (error) {
      console.error('Batch mint error:', error);
      setError(error.message || 'An error occurred during batch minting');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'processing':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.useWhitelist ? item.whitelistPrice : item.price;
      return total + (parseFloat(price) * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const successfulMints = Object.values(mintStatus).filter(status => status.status === 'success').length;
  const failedMints = Object.values(mintStatus).filter(status => status.status === 'error').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Batch Mint
            {totalSteps > 0 && (
              <Badge variant="outline">
                {currentStep}/{totalSteps}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          {isProcessing && totalSteps > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Cart Summary */}
          <div className="space-y-3">
            <h3 className="font-medium">Cart Summary</h3>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <span className="text-sm text-muted-foreground">Total Items:</span>
                <div className="font-medium">{getTotalItems()}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total Price:</span>
                <div className="font-medium font-mono">{calculateTotalPrice().toFixed(6)} ETH</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mint Status */}
          <div className="space-y-3">
            <h3 className="font-medium">Mint Status</h3>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {cart.map((item) => {
                  const status = mintStatus[item.tokenId] || { status: 'pending', message: 'Waiting...' };
                  
                  return (
                    <div 
                      key={item.tokenId} 
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status.status)}
                        <div>
                          <div className="font-medium">Token #{item.tokenId}</div>
                          <div className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                            {item.useWhitelist && (
                              <Badge variant="outline" size="sm" className="ml-2">
                                WL
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm ${getStatusColor(status.status)}`}>
                        {status.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Summary Stats */}
          {Object.keys(mintStatus).length > 0 && (
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{successfulMints}</div>
                <div className="text-xs text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{failedMints}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{totalSteps - successfulMints - failedMints}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isProcessing ? (
              <>
                <Button 
                  onClick={handleBatchMint}
                  disabled={!walletConnected || cart.length === 0}
                  className="flex-1"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Batch Mint
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Close'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 