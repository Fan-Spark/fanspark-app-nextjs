"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  CreditCard,
  Zap,
  Crown
} from "lucide-react";

export default function TokenCard({ 
  token, 
  onMint, 
  walletConnected, 
  address, 
  whitelistStatus,
  onAddToCart,
  isInCart,
  cartQuantity
}) {
  const [mintAmount, setMintAmount] = useState(1);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [whitelistAmount, setWhitelistAmount] = useState(0);
  
  // Check if this user is whitelisted for this token
  useEffect(() => {
    if (whitelistStatus && whitelistStatus.tokens) {
      const whitelistEntry = whitelistStatus.tokens.find(
        entry => entry.tokenId === token.id
      );
      
      if (whitelistEntry) {
        setIsWhitelisted(true);
        setWhitelistAmount(whitelistEntry.amount);
      } else {
        setIsWhitelisted(false);
        setWhitelistAmount(0);
      }
    }
  }, [whitelistStatus, token.id]);

  const handleIncrease = () => {
    const maxAllowed = isWhitelisted && token.isWhitelistActive 
      ? Math.min(parseInt(token.maxMintPerTx), whitelistAmount) 
      : parseInt(token.maxMintPerTx);
      
    if (mintAmount < maxAllowed) {
      setMintAmount(mintAmount + 1);
    }
  };

  const handleDecrease = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };
  
  // Generate a token-specific gradient based on the token ID
  const getTokenGradient = (id) => {
    const gradients = [
      'from-cyan-500 to-blue-500',      // Token 0
      'from-indigo-500 to-purple-500',  // Token 1
      'from-purple-500 to-pink-500',    // Token 2
      'from-pink-500 to-rose-500',      // Token 3
      'from-rose-500 to-orange-500',    // Token 4
      'from-orange-500 to-amber-500',   // Token 5
      'from-amber-500 to-yellow-500',   // Token 6
      'from-yellow-500 to-lime-500',    // Token 7
      'from-lime-500 to-green-500',     // Token 8
      'from-green-500 to-emerald-500',  // Token 9
    ];
    
    return gradients[id % gradients.length];
  };
  
  const getTotalPrice = () => {
    const basePrice = isWhitelisted && token.isWhitelistActive 
      ? token.whitelistPrice 
      : token.price;
    
    const total = (parseFloat(basePrice) * mintAmount).toFixed(6);
    // Remove trailing zeros
    return total.replace(/\.?0+$/, "");
  };

  // Determine if minting is available
  const isMintingAvailable = token.mintingActive || (isWhitelisted && token.isWhitelistActive);
  
  // Fix: Correctly determine if whitelist minting is available
  const canUseWhitelist = walletConnected && isWhitelisted && token.isWhitelistActive;

  const handleAddToCart = () => {
    if (!walletConnected || !isMintingAvailable) return;
    
    try {
      onAddToCart(
        token.id, 
        mintAmount, 
        canUseWhitelist,
        token.price,
        token.whitelistPrice
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // For the credit card payment button
  const CreditCardButton = () => {
    return (
      <Button 
        variant="outline"
        className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"
        onClick={() => {
          const basePrice = isWhitelisted && token.isWhitelistActive 
            ? token.whitelistPrice 
            : token.price;
          
          const totalPrice = (parseFloat(basePrice) * mintAmount).toString();
          const projectId = process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID;
          const baseUrl = process.env.NEXT_PUBLIC_CROSSMINT_BASE_URL || "https://staging.crossmint.com";
          
          const url = `${baseUrl}/checkout?clientId=${projectId}&mintConfig[type]=erc-1155&mintConfig[tokenId]=${token.id}&mintConfig[amount]=${mintAmount}&mintConfig[totalPrice]=${totalPrice}`;
          
          console.log("Opening Crossmint URL:", url);
          window.open(url, '_blank');
        }}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Pay with Card
      </Button>
    );
  };

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02]">
      {/* Token Header with Gradient */}
      <div className={`relative h-48 bg-gradient-to-br ${getTokenGradient(token.id)} group-hover:scale-[1.02] transition-transform duration-300`}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
             style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')"}} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 flex items-center justify-center">
          <div className="text-center">
            <div className="font-bold text-7xl text-white mb-1 text-shadow-lg">{token.id}</div>
          </div>
        </div>
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isWhitelisted && token.isWhitelistActive && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/20">
              <Crown className="w-3 h-3 mr-1" />
              WHITELISTED
            </Badge>
          )}
          
          {isInCart && (
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
              <ShoppingCart className="w-3 h-3 mr-1" />
              {cartQuantity}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Token Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Token #{token.id}</h3>
          </div>
          <Badge variant="outline" className="font-mono">
            {isWhitelisted && token.isWhitelistActive 
              ? `${token.whitelistPrice} ETH` 
              : `${token.price} ETH`}
          </Badge>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted/50 rounded-lg p-3">
            <Label className="text-xs text-muted-foreground">Minted</Label>
            <div className="font-medium">{token.minted} / {token.maxSupply}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <Label className="text-xs text-muted-foreground">Available</Label>
            <div className="font-medium">{token.unminted}</div>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm">Quantity</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrease}
              disabled={mintAmount <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(parseInt(e.target.value) || 1)}
              min={1}
              max={isWhitelisted && token.isWhitelistActive 
                ? Math.min(parseInt(token.maxMintPerTx), whitelistAmount)
                : parseInt(token.maxMintPerTx)}
              className="w-16 text-center"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrease}
              disabled={mintAmount >= (isWhitelisted && token.isWhitelistActive 
                ? Math.min(parseInt(token.maxMintPerTx), whitelistAmount)
                : parseInt(token.maxMintPerTx))}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={handleAddToCart}
            disabled={!isMintingAvailable || !walletConnected}
            className="w-full"
            variant={isInCart ? "outline" : "default"}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {!walletConnected 
              ? "Connect Wallet" 
              : !isMintingAvailable
                ? "Not Available"
                : isInCart
                  ? "Update Cart"
                  : "Add to Cart"}
          </Button>

          {/* Quick mint option */}
          {isMintingAvailable && walletConnected && !isInCart && (
            <Button 
              variant="outline"
              onClick={() => onMint(token.id, mintAmount, canUseWhitelist)}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Quick Mint
            </Button>
          )}
          
          {/* Credit Card Payment Button */}
          {isMintingAvailable && !isInCart && (
            <CreditCardButton />
          )}
        </div>

        {/* Price display */}
        {isMintingAvailable && walletConnected && (
          <div className="text-center mt-3 text-sm text-muted-foreground">
            Total: {getTotalPrice()} ETH
          </div>
        )}
      </CardContent>
    </Card>
  );
} 