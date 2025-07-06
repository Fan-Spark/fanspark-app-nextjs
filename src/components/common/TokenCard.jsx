"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  CreditCard,
  Zap,
  Crown,
  Loader2,
  Gift,
  Star,
  Info,
  Trophy,
  Sparkles,
  Package,
  Coins,
  Tag
} from "lucide-react";

export default function TokenCard({ 
  token, 
  onMint, 
  walletConnected, 
  address, 
  whitelistStatus,
  onAddToCart,
  isInCart,
  cartQuantity,
  isMinting = false
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

  // Get rarity info and color
  const getRarityInfo = () => {
    const rarityAttr = token.attributes?.find(attr => attr.trait_type === "Rarity");
    const rarity = rarityAttr?.value || "Common";
    
    const rarityColors = {
      "Common": "bg-gray-500/20 text-gray-300 border-gray-500/20",
      "Rare": "bg-blue-500/20 text-blue-300 border-blue-500/20",
      "Legendary": "bg-purple-500/20 text-purple-300 border-purple-500/20",
      "Epic": "bg-orange-500/20 text-orange-300 border-orange-500/20",
      "Mythic": "bg-pink-500/20 text-pink-300 border-pink-500/20"
    };
    
    return {
      rarity,
      colorClass: rarityColors[rarity] || rarityColors["Common"]
    };
  };

  // Get tier info
  const getTierInfo = () => {
    const tierAttr = token.attributes?.find(attr => attr.trait_type === "Tier");
    return tierAttr?.value || `Token #${token.id}`;
  };

  // Get edition type
  const getEditionType = () => {
    const editionAttr = token.attributes?.find(attr => attr.trait_type === "Edition Type");
    return editionAttr?.value || "Standard Edition";
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
    // Don't render if card payments are disabled
    if (process.env.NEXT_PUBLIC_ENABLE_CARD_PAYMENTS !== 'true') {
      return null;
    }

    return (
      <Button 
        variant="outline"
        size="sm"
        className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"
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
        Card
      </Button>
    );
  };

  const rarityInfo = getRarityInfo();

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01] h-[680px] flex flex-col">
      {/* Token Header with Image - Fixed Height */}
      <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-800 group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden flex-shrink-0">
        {token.image ? (
          <>
            {/* NFT Image */}
            <img 
              src={token.image} 
              alt={token.name || `Token #${token.id}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback gradient (hidden by default) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getTokenGradient(token.id)} hidden items-center justify-center`}>
              <div className="text-center">
                <div className="font-bold text-6xl text-white mb-1 text-shadow-lg">{token.id}</div>
              </div>
            </div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${getTokenGradient(token.id)} flex items-center justify-center`}>
            <div className="text-center">
              <div className="font-bold text-6xl text-white mb-1 text-shadow-lg">{token.id}</div>
            </div>
          </div>
        )}
        
        {/* Dark overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 pointer-events-none" />
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {/* Rarity Badge */}
          <Badge variant="secondary" className={`${rarityInfo.colorClass} text-xs`}>
            <Star className="w-3 h-3 mr-1" />
            {rarityInfo.rarity}
          </Badge>
          
          {isWhitelisted && token.isWhitelistActive && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/20 text-xs">
              <Crown className="w-3 h-3 mr-1" />
              WL
            </Badge>
          )}
          
          {isInCart && (
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 text-xs">
              <ShoppingCart className="w-3 h-3 mr-1" />
              {cartQuantity}
            </Badge>
          )}
        </div>

        {/* Edition Type Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-black/40 text-white/90 border-white/20 text-xs">
            {getEditionType()}
          </Badge>
        </div>

        {/* Price Badge - Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="bg-black/40 text-white/90 border-white/20 font-mono text-xs">
            {isWhitelisted && token.isWhitelistActive 
              ? `${token.whitelistPrice} ETH` 
              : `${token.price} ETH`}
          </Badge>
        </div>
      </div>
      
      {/* Card Content - Flexible Height */}
      <CardContent className="p-4 flex-1 flex flex-col min-h-0">
        {/* Token Info Header */}
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-lg font-semibold mb-1 truncate">{token.name || getTierInfo()}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>{token.minted} / {token.unlimited ? "∞" : token.maxSupply}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>{token.unlimited ? "Unlimited" : token.unminted} left</span>
            </div>
          </div>
        </div>

        {/* Tabs for organized content - Takes available space */}
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-3 h-8 mb-3 flex-shrink-0">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="rewards" className="text-xs">Rewards</TabsTrigger>
              <TabsTrigger value="attributes" className="text-xs">Details</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-3">
                  {/* Description */}
                  {token.description && (
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {token.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <Label className="text-xs text-muted-foreground">Max per TX</Label>
                      <div className="text-sm font-medium">{token.maxMintPerTx}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <Label className="text-xs text-muted-foreground">Progress</Label>
                      <div className="text-sm font-medium">{token.mintedPercentage}%</div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-2">
                  {token.properties?.rewards && token.properties.rewards.length > 0 ? (
                    token.properties.rewards.map((reward, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2" />
                        <span className="text-sm text-muted-foreground">{reward}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Gift className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No rewards information available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Attributes Tab */}
            <TabsContent value="attributes" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-2">
                  {token.attributes && token.attributes.length > 0 ? (
                    token.attributes.map((attr, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          {attr.trait_type === '$ARDENT Tokens' && <Coins className="w-3 h-3 text-primary" />}
                          {attr.trait_type === 'PFP Collectibles' && <Package className="w-3 h-3 text-primary" />}
                          {attr.trait_type === 'Max Supply' && <Trophy className="w-3 h-3 text-primary" />}
                          {!['$ARDENT Tokens', 'PFP Collectibles', 'Max Supply'].includes(attr.trait_type) && <Tag className="w-3 h-3 text-primary" />}
                          <span className="text-xs text-muted-foreground">{attr.trait_type}</span>
                        </div>
                        <span className="text-sm font-medium">{attr.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No attributes available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Bottom Section - Always Visible */}
        <div className="flex-shrink-0 space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Quantity</Label>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecrease}
                disabled={mintAmount <= 1}
                className="h-7 w-7 p-0"
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
                className="w-14 text-center h-7 text-sm"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncrease}
                disabled={mintAmount >= (isWhitelisted && token.isWhitelistActive 
                  ? Math.min(parseInt(token.maxMintPerTx), whitelistAmount)
                  : parseInt(token.maxMintPerTx))}
                className="h-7 w-7 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handleAddToCart}
              disabled={!isMintingAvailable || !walletConnected || isMinting}
              className="w-full h-9"
              variant={isInCart ? "outline" : "default"}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {!walletConnected 
                ? "Add to Cart" 
                : !isMintingAvailable
                  ? "Not Available"
                  : isMinting
                    ? "Minting..."
                  : isInCart
                    ? "Update Cart"
                    : "Add to Cart"}
            </Button>

            {/* Action buttons row */}
            <div className="flex gap-2">
              {/* Quick mint option */}
              {isMintingAvailable && walletConnected && !isInCart && (
                <Button 
                  variant="outline"
                  onClick={() => onMint(token.id, mintAmount, canUseWhitelist)}
                  disabled={isMinting}
                  className="flex-1 h-9"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Mint
                    </>
                  )}
                </Button>
              )}
              
              {/* Credit Card Payment Button */}
              {isMintingAvailable && !isInCart && (
                <CreditCardButton />
              )}
            </div>
          </div>

          {/* Price display */}
          {isMintingAvailable && walletConnected && (
            <div className="text-center text-sm text-muted-foreground">
              Total: <span className="font-medium text-foreground">{getTotalPrice()} ETH</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 