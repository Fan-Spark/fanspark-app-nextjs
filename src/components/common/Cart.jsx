"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  Zap,
  CreditCard,
  X
} from "lucide-react";

export default function Cart({ 
  cart, 
  onRemoveFromCart, 
  onUpdateQuantity, 
  onBatchMint, 
  onClearCart,
  walletConnected,
  address 
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.useWhitelist ? item.whitelistPrice : item.price;
      return total + (parseFloat(price) * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleBatchMint = async () => {
    if (!walletConnected || cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onBatchMint();
    } catch (error) {
      console.error('Batch mint error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = (tokenId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveFromCart(tokenId);
    } else {
      onUpdateQuantity(tokenId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" />
            Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">
            Add some tokens to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" />
            Cart
            <Badge variant="secondary" className="ml-2">
              {getTotalItems()}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.tokenId} className="group">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      {item.useWhitelist && (
                        <Badge variant="outline" size="sm" className="text-xs">
                          WL
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(item.useWhitelist ? item.whitelistPrice : item.price)} ETH each
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.tokenId, item.quantity - 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.tokenId, item.quantity + 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromCart(item.tokenId)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        {/* Cart Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Items:</span>
            <span className="font-medium">{getTotalItems()}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Price:</span>
            <span className="font-medium font-mono">
              {calculateTotalPrice().toFixed(6)} ETH
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button 
              onClick={handleBatchMint}
              disabled={!walletConnected || isProcessing}
              className="w-full"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              {!walletConnected 
                ? "Connect Wallet" 
                : isProcessing 
                  ? "Processing..." 
                  : "Batch Mint"}
            </Button>

            {/* Credit Card Payment for entire cart */}
            {walletConnected && process.env.NEXT_PUBLIC_ENABLE_CARD_PAYMENTS === 'true' && (
              <Button 
                variant="outline"
                className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"
                onClick={() => {
                  const projectId = process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID;
                  const baseUrl = process.env.NEXT_PUBLIC_CROSSMINT_BASE_URL || "https://staging.crossmint.com";
                  
                  // For now, just open the first item in cart
                  // In a real implementation, you'd need to handle multiple items
                  const firstItem = cart[0];
                  if (firstItem) {
                    const totalPrice = (parseFloat(firstItem.useWhitelist ? firstItem.whitelistPrice : firstItem.price) * firstItem.quantity).toString();
                    const url = `${baseUrl}/checkout?clientId=${projectId}&mintConfig[type]=erc-1155&mintConfig[tokenId]=${firstItem.tokenId}&mintConfig[amount]=${firstItem.quantity}&mintConfig[totalPrice]=${totalPrice}`;
                    window.open(url, '_blank');
                  }
                }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay with Card
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 