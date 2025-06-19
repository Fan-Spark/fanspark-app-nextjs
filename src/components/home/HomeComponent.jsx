"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import contractABI from "@/utils/contractABI.json";
import { formatEther } from "ethers/lib/utils";
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK, getNetworkById } from "@/utils/networkConfig";
import { useCart } from '@/components/CartProvider';
import { useTheme } from '@/components/common/ThemeProvider';

// Import our new professional components
import TokenCard from "@/components/common/TokenCard";
import Cart from "@/components/common/Cart";
import CartButton from "@/components/common/CartButton";
import BatchMintModal from "@/components/common/BatchMintModal";
import NetworkModal from "@/components/common/NetworkModal";
import ComingSoonPage from "@/components/common/ComingSoonPage";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  Loader2, 
  AlertTriangle,
  Crown,
  Zap,
  ShoppingCart,
  ExternalLink,
  Package,
  StickyNote,
  Trophy,
  Star,
  RefreshCw,
  Sparkles,
  Rocket,
  Shield,
  Coins,
  Users,
  X,
  Minus,
  Plus,
  Trash2
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Utility function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to retry with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // If it's a 429 error, wait longer
      const waitTime = error.status === 429 ? baseDelay * Math.pow(2, i + 1) : baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${waitTime}ms due to:`, error.message);
      await delay(waitTime);
    }
  }
};

export default function HomeComponent() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const [tokens, setTokens] = useState([]);
  const [showBatchMintModal, setShowBatchMintModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [currentYear, setCurrentYear] = useState('');
  const [whitelistStatus, setWhitelistStatus] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState("reward-crate");
  const [retryCount, setRetryCount] = useState(0);
  const { theme, setTheme } = useTheme();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, isInCart } = useCart();

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // Set current year on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  // Check if user is on correct network
  useEffect(() => {
    if (wallet && connectedChain) {
      const isSupported = Object.values(SUPPORTED_NETWORKS).some(
        network => network.id.toLowerCase() === connectedChain.id.toLowerCase()
      );
      setIsCorrectNetwork(isSupported);
      
      if (!isSupported) {
        setShowNetworkModal(true);
      }
    }
  }, [wallet, connectedChain]);

  // Fetch whitelist status when wallet connects
  useEffect(() => {
    const checkWhitelist = async () => {
      if (!wallet) {
        setWhitelistStatus(null);
        return;
      }
      
      try {
        const address = wallet.accounts[0].address;
        console.log("Checking whitelist for address:", address);
        
        const response = await fetch(`/api/whitelist?address=${address}`);
        
        if (!response.ok) {
          throw new Error('Failed to check whitelist status');
        }
        
        const data = await response.json();
        console.log("Whitelist status result:", data);
        setWhitelistStatus(data);
      } catch (err) {
        console.error("Error checking whitelist status:", err);
        setWhitelistStatus(null);
      }
    };
    
    checkWhitelist();
  }, [wallet]);

  // Optimized fetch function that fetches tokens one by one but displays them as they're fetched
  const fetchTokenInfo = useCallback(async () => {
    if (!isCorrectNetwork) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setTokens([]); // Clear existing tokens to show fresh loading
      
      // If wallet is connected, use it; otherwise use a default provider
      let provider;
      if (wallet) {
        provider = new ethers.providers.Web3Provider(wallet.provider);
      } else {
        // Use a default provider for read-only operations
        provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      }
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      
      // Fetch tokens one by one but display them as they're fetched
      for (let i = 0; i < 10; i++) {
        try {
          // Add a small delay between requests to avoid rate limiting
          if (i > 0) {
            await delay(200); // 200ms delay between requests
          }
          
          // Fetch config and unminted supply for this token
          const [config, unminted] = await Promise.all([
            contract.tokenConfigs(i),
            contract.getUnmintedSupply(i)
          ]);
          
          // Add debug logging
          console.log(`Token #${i} config:`, {
            price: formatEther(config.price),
            whitelistPrice: formatEther(config.whitelistPrice),
            isWhitelistActive: config.isWhitelistActive,
            mintingActive: config.mintingActive
          });
          
          const tokenInfo = {
            id: i,
            price: formatEther(config.price),
            whitelistPrice: formatEther(config.whitelistPrice),
            maxSupply: config.unlimited ? "∞" : config.maxSupply.toString(),
            minted: config.minted.toString(),
            maxMintPerTx: config.maxMintPerTx.toString(),
            mintingActive: config.mintingActive,
            isWhitelistActive: config.isWhitelistActive,
            unlimited: config.unlimited,
            unminted: config.unlimited ? "Unlimited" : unminted.toString()
          };
          
          // Add this token to the state immediately
          setTokens(prevTokens => {
            const newTokens = [...prevTokens];
            newTokens[i] = tokenInfo;
            return newTokens;
          });
          
        } catch (err) {
          console.error(`Error fetching token ${i}:`, err);
          
          // Wait 1 second on any error before retrying
          console.log(`Error while fetching token ${i}, waiting 1 second before retry...`);
          setError(`Loading token ${i + 1}/10... Please wait.`);
          await delay(1000); // Wait 1 second before retrying
          
          // Try to fetch this token again
          try {
            const [config, unminted] = await Promise.all([
              contract.tokenConfigs(i),
              contract.getUnmintedSupply(i)
            ]);
            
            console.log(`Token #${i} config (retry):`, {
              price: formatEther(config.price),
              whitelistPrice: formatEther(config.whitelistPrice),
              isWhitelistActive: config.isWhitelistActive,
              mintingActive: config.mintingActive
            });
            
            const tokenInfo = {
              id: i,
              price: formatEther(config.price),
              whitelistPrice: formatEther(config.whitelistPrice),
              maxSupply: config.unlimited ? "∞" : config.maxSupply.toString(),
              minted: config.minted.toString(),
              maxMintPerTx: config.maxMintPerTx.toString(),
              mintingActive: config.mintingActive,
              isWhitelistActive: config.isWhitelistActive,
              unlimited: config.unlimited,
              unminted: config.unlimited ? "Unlimited" : unminted.toString()
            };
            
            setTokens(prevTokens => {
              const newTokens = [...prevTokens];
              newTokens[i] = tokenInfo;
              return newTokens;
            });
            
          } catch (retryErr) {
            console.error(`Failed to fetch token ${i} after retry:`, retryErr);
            // Add a placeholder token for failed fetches
            const placeholderToken = {
              id: i,
              price: "0",
              whitelistPrice: "0",
              maxSupply: "0",
              minted: "0",
              maxMintPerTx: "0",
              mintingActive: false,
              isWhitelistActive: false,
              unlimited: false,
              unminted: "0",
              error: true
            };
            
            setTokens(prevTokens => {
              const newTokens = [...prevTokens];
              newTokens[i] = placeholderToken;
              return newTokens;
            });
          }
        }
      }
      
      setIsLoading(false);
      setError(null); // Clear any error messages
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      console.error("Error in fetchTokenInfo:", err);
      
      // Handle specific error types
      if (err.message?.includes('Rate limited') || err.status === 429) {
        setError("Network is busy. Please wait a moment and try again.");
        setRetryCount(prev => prev + 1);
      } else if (err.message?.includes('Failed to fetch')) {
        setError("Network connection issue. Please check your internet connection.");
      } else {
        setError("Failed to load token data. Please check your connection and try again.");
      }
      
      setIsLoading(false);
    }
  }, [wallet, CONTRACT_ADDRESS, isCorrectNetwork]);

  // Fetch token data when on correct network
  useEffect(() => {
    if (isCorrectNetwork) {
      fetchTokenInfo();
    }
  }, [isCorrectNetwork, fetchTokenInfo]);

  // Auto-retry on rate limit errors
  useEffect(() => {
    if (error && retryCount < 3 && error.includes('Network is busy')) {
      const timer = setTimeout(() => {
        console.log(`Auto-retrying fetch (attempt ${retryCount + 1})`);
        fetchTokenInfo();
      }, 2000 * (retryCount + 1)); // Exponential backoff: 2s, 4s, 6s
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, fetchTokenInfo]);

  const handleSwitchNetwork = async (network) => {
    const success = await setChain({ chainId: network.chainId });
    if (success) {
      setShowNetworkModal(false);
      setIsCorrectNetwork(true);
    }
  };

  // Add this function to fetch Merkle proofs
  const fetchWhitelistProof = async (address, tokenId) => {
    try {
      const response = await fetch(`/api/whitelist-proof?address=${address}&tokenId=${tokenId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch whitelist proof');
      }
      
      return await response.json();
    } catch (err) {
      console.error("Error fetching whitelist proof:", err);
      return { isWhitelisted: false, proof: [] };
    }
  };

  // Update the handleMint function to call mintWhitelist correctly
  const handleMint = async (tokenId, amount, useWhitelist = false) => {
    if (!wallet) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(wallet.provider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const address = wallet.accounts[0].address;
      
      const token = tokens.find(t => t.id === tokenId);
      if (!token) {
        throw new Error(`Token with ID ${tokenId} not found`);
      }
      
      const priceStr = useWhitelist ? token.whitelistPrice : token.price;
      if (!priceStr) {
        throw new Error(`Price information for token #${tokenId} is not available`);
      }
      
      const price = ethers.utils.parseEther(priceStr);
      const amountBN = ethers.BigNumber.from(amount);
      const totalPrice = price.mul(amountBN);
      
      console.log(`Minting token #${tokenId}, amount: ${amount}, price: ${priceStr} ETH, total: ${totalPrice.toString()}`);
      
      // Call the appropriate mint function based on whitelist status
      let tx;
      if (useWhitelist) {
        // Fetch the Merkle proof for this address and token
        const proofData = await fetchWhitelistProof(address, tokenId);
        
        if (!proofData.isWhitelisted) {
          alert("You are not whitelisted for this token.");
          return;
        }
        
        console.log("Sending whitelist mint with proof:", proofData.proof);
        
        // Call mintWhitelist with the Merkle proof
        tx = await contract.mintWhitelist(
          tokenId, 
          amount, 
          proofData.proof,
          address, // Use connected wallet address as recipient
          { value: totalPrice }
        );
      } else {
        // Call mint with the recipient
        tx = await contract.mint(
          tokenId, 
          amount, 
          address, // Use connected wallet address as recipient
          { value: totalPrice }
        );
      }
      
      await tx.wait();
      alert(`Successfully minted token #${tokenId}`);
      
      // Refresh token data after successful mint
      fetchTokenInfo();
      
    } catch (err) {
      console.error("Error minting token:", err);
      alert(`Error minting token: ${err.message || err}`);
    }
  };
  
  // Also update the batch mint function for whitelist
  const handleBatchMint = async (tokenId, amount, useWhitelist) => {
    if (!wallet) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(wallet.provider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const address = wallet.accounts[0].address;
      
      const token = tokens.find(t => t.id === tokenId);
      if (!token) {
        throw new Error(`Token with ID ${tokenId} not found`);
      }
      
      const priceStr = useWhitelist ? token.whitelistPrice : token.price;
      if (!priceStr) {
        throw new Error(`Price information for token #${tokenId} is not available`);
      }
      
      const price = ethers.utils.parseEther(priceStr);
      const amountBN = ethers.BigNumber.from(amount);
      const totalPrice = price.mul(amountBN);
      
      console.log(`Batch minting token #${tokenId}, amount: ${amount}, price: ${priceStr} ETH, total: ${totalPrice.toString()}`);
      
      let tx;
      if (useWhitelist) {
        const proofData = await fetchWhitelistProof(address, tokenId);
        
        if (!proofData.isWhitelisted) {
          throw new Error(`You are not whitelisted for token #${tokenId}`);
        }
        
        tx = await contract.mintWhitelist(
          tokenId, 
          amount, 
          proofData.proof,
          address,
          { value: totalPrice }
        );
      } else {
        tx = await contract.mint(
          tokenId, 
          amount, 
          address,
          { value: totalPrice }
        );
      }
      
      await tx.wait();
      
      // Remove from cart after successful mint
      removeFromCart(tokenId);
      
      // Refresh token data
      await fetchTokenInfo();
      
    } catch (err) {
      console.error("Error batch minting token:", err);
      throw err;
    }
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCollectionInfo = (collectionId) => {
    const collectionConfigs = {
      "sticker-collection": {
        name: "Sticker Collection",
        description: "Coming Soon",
        icon: StickyNote,
        expectedDate: "Q1 2025"
      },
      "chain-competition": {
        name: "Chain Competition",
        description: "Soulbound Tokens",
        icon: Trophy,
        expectedDate: "Q2 2025"
      },
      "featured-fs": {
        name: "Featured FS Collectibles",
        description: "Premium Collection",
        icon: Star,
        expectedDate: "Q4 2024"
      }
    };
    
    return collectionConfigs[collectionId] || {
      name: "Coming Soon",
      description: "This collection is under development",
      icon: Package,
      expectedDate: "TBD"
    };
  };

  const supportedNetworks = Object.values(SUPPORTED_NETWORKS).map(network => ({
    chainId: network.id,
    name: network.label,
    explorerUrl: network.blockExplorerUrl
  }));

  const currentNetwork = connectedChain ? {
    chainId: connectedChain.id,
    name: connectedChain.label,
    explorerUrl: SUPPORTED_NETWORKS[connectedChain.id]?.blockExplorerUrl
  } : null;

  // Collection configurations
  const collectionConfigs = {
    "sticker-collection": {
      name: "Sticker Collection",
      description: "Exclusive digital stickers for the SSD community",
      icon: StickyNote,
      expectedDate: "Q2 2024"
    },
    "chain-competition": {
      name: "Chain Competition",
      description: "Soulbound tokens for competitive achievements",
      icon: Trophy,
      expectedDate: "Q3 2024"
    },
    "featured-fs": {
      name: "Featured FS Collectibles",
      description: "Premium collectibles with special utilities",
      icon: Star,
      expectedDate: "Q4 2024"
    }
  };

  // Hero Section Component
  const HeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 rounded-3xl border border-border/30 shadow-2xl mb-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              Reward Crate
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Unlock exclusive rewards and collect rare NFTs from the Super Space Defenders universe
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm rounded-full border border-border/30">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">ERC1155 Standard</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm rounded-full border border-border/30">
                <Coins className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">Base Network</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm rounded-full border border-border/30">
                <Users className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">Community Driven</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-border/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">10</p>
                  <p className="text-xs text-muted-foreground">Unique Rewards</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Exclusive collectibles with varying rarities</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-border/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Limited</p>
                  <p className="text-xs text-muted-foreground">Supply</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Most tokens have limited availability</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-border/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Whitelist</p>
                  <p className="text-xs text-muted-foreground">Priority Access</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Exclusive benefits for community members</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg px-6 py-2 text-base font-semibold"
                onClick={() => {
                  if (!wallet) {
                    connect();
                  } else {
                    // Scroll to tokens section
                    document.getElementById('tokens-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {wallet ? (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Start Collecting
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-border/30 hover:bg-accent/20 px-6 py-2 text-base font-semibold"
                onClick={() => window.open('https://basescan.org', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on BaseScan
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Join thousands of collectors in the Super Space Defenders ecosystem
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pr-6 lg:pr-8">
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTokenInfo}
              disabled={isLoading}
              className="ml-4"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : activeCollection === "reward-crate" ? (
        <div className="space-y-6">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="tokens-section">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Available Rewards</h1>
              {whitelistStatus && whitelistStatus.isWhitelisted && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  <Crown className="w-3 h-3 mr-1" />
                  Whitelisted
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <CartButton 
                cartItemCount={getTotalCartItems()}
                onClick={() => setIsCartOpen(true)}
              />
              <Button
                variant="outline"
                onClick={() => setShowBatchMintModal(true)}
                disabled={cart.length === 0}
              >
                <Zap className="w-4 h-4 mr-2" />
                Batch Mint
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tokens Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tokens.map(token => (
              <TokenCard 
                key={token.id} 
                token={token}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={updateQuantity}
                isInCart={isInCart(token.id)}
                cartQuantity={getCartQuantity(token.id)}
                whitelistStatus={whitelistStatus}
                onMint={handleMint}
                isCorrectNetwork={isCorrectNetwork}
                wallet={wallet}
              />
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && tokens.length === 0 && !error && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rewards available</h3>
              <p className="text-muted-foreground">Check back later for new rewards!</p>
            </div>
          )}
        </div>
      ) : (
        <ComingSoonPage collection={getCollectionInfo(activeCollection)} />
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Sidebar */}
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-background shadow-2xl border-l border-border/50">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Cart</h2>
                  {cart.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getTotalCartItems()}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-hidden">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">
                      Add some tokens to get started
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Cart Items */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.tokenId} className="group">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium truncate">Token #{item.tokenId}</h4>
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
                                    onClick={() => updateQuantity(item.tokenId, item.quantity - 1)}
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
                                    onClick={() => updateQuantity(item.tokenId, item.quantity + 1)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.tokenId)}
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

                    {/* Cart Summary */}
                    <div className="p-4 border-t border-border/50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Items:</span>
                          <span className="font-medium">{getTotalCartItems()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Price:</span>
                          <span className="font-medium font-mono">
                            {cart.reduce((total, item) => {
                              const price = item.useWhitelist ? item.whitelistPrice : item.price;
                              return total + (parseFloat(price) * item.quantity);
                            }, 0).toFixed(6)} ETH
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2">
                          <Button 
                            onClick={() => setShowBatchMintModal(true)}
                            disabled={!wallet || !isCorrectNetwork}
                            className="w-full"
                            size="lg"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            {!wallet 
                              ? "Connect Wallet" 
                              : !isCorrectNetwork
                                ? "Wrong Network"
                                : "Batch Mint"}
                          </Button>

                          <Button 
                            variant="outline"
                            onClick={clearCart}
                            className="w-full"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <BatchMintModal
        isOpen={showBatchMintModal}
        onClose={() => setShowBatchMintModal(false)}
        cart={cart}
        onMint={handleBatchMint}
        isCorrectNetwork={isCorrectNetwork}
        wallet={wallet}
      />

      <NetworkModal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onSwitchNetwork={handleSwitchNetwork}
        supportedNetworks={Object.values(SUPPORTED_NETWORKS)}
        currentNetwork={connectedChain ? {
          chainId: connectedChain.id,
          name: connectedChain.label,
          explorerUrl: SUPPORTED_NETWORKS[connectedChain.id]?.blockExplorer
        } : null}
      />

      {/* Footer */}
      <footer className="border-t py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SSD Super Space Defenders · Base Network · {currentYear}</p>
        </div>
      </footer>
    </div>
  );
}