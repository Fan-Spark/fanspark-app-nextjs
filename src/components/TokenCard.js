'use client';

import { useState, useEffect } from "react";

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
        token.price,        // Make sure these values exist in your token data
        token.whitelistPrice
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/80 hover:border-cyan-500/30 transition-all group hover:shadow-lg hover:shadow-cyan-900/30 hover:scale-[1.01]">
      <div className={`relative h-48 bg-gradient-to-br ${getTokenGradient(token.id)} group-hover:scale-[1.02] transition-transform duration-300`}>
        {/* Create a subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
             style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')"}}></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 flex items-center justify-center">
          <div className="text-center">
            <div className="font-bold text-7xl text-white mb-1 text-shadow-lg">{token.id}</div>
          </div>
        </div>
        
        {/* Status badge */}
        {isWhitelisted && token.isWhitelistActive && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-amber-500 px-2 py-1 rounded text-xs font-bold text-black shadow-md">
            WHITELISTED
          </div>
        )}
        
        {/* Add cart badge if in cart */}
        {isInCart && (
          <div className="absolute top-3 left-3 bg-cyan-500 px-2 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{cartQuantity}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="text-md font-semibold text-white">Token #{token.id}</div>
          </div>
          <div className="font-mono text-sm font-medium bg-slate-700/60 px-2 py-1 rounded text-cyan-300">
            {isWhitelisted && token.isWhitelistActive 
              ? `${token.whitelistPrice} ETH` 
              : `${token.price} ETH`}
          </div>
        </div>
        
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="bg-slate-700/40 rounded-md py-2 px-3">
            <div className="text-xs text-slate-400 mb-1">Minted</div>
            <div className="font-medium text-sm">{token.minted} / {token.maxSupply}</div>
          </div>
          <div className="bg-slate-700/40 rounded-md py-2 px-3">
            <div className="text-xs text-slate-400 mb-1">Available</div>
            <div className="font-medium text-sm">{token.unminted}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-slate-400">
            Quantity
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleDecrease}
              className="bg-slate-700 hover:bg-slate-600 w-7 h-7 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={mintAmount <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <div className="font-mono text-md bg-slate-700/50 px-3 py-1 rounded-md min-w-[3rem] text-center">
              {mintAmount}
            </div>
            
            <button 
              onClick={handleIncrease}
              className="bg-slate-700 hover:bg-slate-600 w-7 h-7 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={mintAmount >= (isWhitelisted && token.isWhitelistActive 
                ? Math.min(parseInt(token.maxMintPerTx), whitelistAmount)
                : parseInt(token.maxMintPerTx))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Cart and Mint buttons */}
        <div className="grid gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={!isMintingAvailable || !walletConnected}
            className={`w-full py-2.5 px-4 rounded-md font-bold text-sm transition-all ${
              isMintingAvailable && walletConnected
                ? isInCart
                  ? "bg-cyan-500/20 text-cyan-300 border-2 border-cyan-500 hover:bg-cyan-500/30"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-md hover:shadow-cyan-500/25 hover:translate-y-[-1px]"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {!walletConnected 
              ? "Connect Wallet" 
              : !isMintingAvailable
                ? "Not Available"
                : isInCart
                  ? "Update Cart"
                  : "Add to Cart"}
          </button>

          {/* Quick mint option */}
          {isMintingAvailable && walletConnected && !isInCart && (
            <button 
              onClick={() => onMint(token.id, mintAmount, canUseWhitelist)}
              className="w-full py-2 px-4 rounded-md font-medium text-sm transition-all border-2 border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300"
            >
              Quick Mint
            </button>
          )}
        </div>

        {/* Price display */}
        {isMintingAvailable && walletConnected && (
          <div className="text-center mt-2 text-xs text-cyan-100/50">
            Total: {getTotalPrice()} ETH
          </div>
        )}
      </div>
    </div>
  );
} 