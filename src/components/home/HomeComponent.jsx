"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { useDynamicWallet } from '@/hooks/useDynamicWallet';
import { useContractDataSync } from '@/hooks/useContractDataSync';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import contractABI from "@/utils/contractABI.json";
import { formatEther } from "ethers/lib/utils";
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK, getNetworkById, CURRENT_NETWORK, getTransactionUrl, getContractUrl, BRAND_CONFIG } from "@/utils/networkConfig";
import { useCart } from '@/components/CartProvider';
import { useTheme } from '@/components/common/ThemeProvider';

// Import our new professional components
import TokenCard from "@/components/common/TokenCard";
import Cart from "@/components/common/Cart";
import CartButton from "@/components/common/CartButton";
import BatchMintModal from "@/components/common/BatchMintModal";
import NetworkModal from "@/components/common/NetworkModal";
import ComingSoonPage from "@/components/common/ComingSoonPage";
import SyncIndicator from "@/components/common/SyncIndicator";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import WelcomePopup from "@/components/common/WelcomePopup";
import MintSuccessPopup from "@/components/common/MintSuccessPopup";

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
  Minus,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'react-toastify';

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
  const { 
    isConnected, 
    hasWallet,
    isConnecting, 
    walletAddress, 
    network,
    primaryWallet,
    connect,
    disconnect,
    openConnectionModal,
    switchToCurrentNetwork,
    switchToNetwork,
  } = useDynamicWallet();
  
  // Use the enhanced cached contract data with real-time sync
  const { 
    tokens, 
    isLoading: isDataLoading, 
    error: dataError, 
    isDataStale, 
    getDataAge, 
    refresh: refreshContractData,
    // Sync features
    isListening,
    lastSyncTime,
    pendingRefresh,
    autoSyncEnabled,
    setAutoSyncEnabled,
    autoSyncInterval,
    setAutoSyncInterval,
    startEventListening,
    stopEventListening,
    checkForUpdates
  } = useContractDataSync();
  
  const [showBatchMintModal, setShowBatchMintModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [currentYear, setCurrentYear] = useState('');
  const [whitelistStatus, setWhitelistStatus] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState("reward-crate");
  const [showMintSuccessPopup, setShowMintSuccessPopup] = useState(false);
  
  // Minting state management
  const [mintingStates, setMintingStates] = useState({}); // Track loading per token
  
  const { theme, setTheme } = useTheme();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, isInCart } = useCart();

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // Minting state helpers
  const setTokenMinting = useCallback((tokenId, isLoading) => {
    setMintingStates(prev => ({
      ...prev,
      [tokenId]: isLoading
    }));
  }, []);

  const isTokenMinting = useCallback((tokenId) => {
    return mintingStates[tokenId] || false;
  }, [mintingStates]);

  // Utility function to show error toasts with user-friendly messages
  const showErrorToast = useCallback((error, tokenId = null) => {
    try {
      
      let message = "An unknown error occurred";
      
      // Extract message from various error formats
      if (typeof error === 'string') {
        message = error;
      } else if (error?.message) {
        message = error.message;
      } else if (error?.reason) {
        message = error.reason;
      } else if (error?.data?.message) {
        message = error.data.message;
      }
      
      // Handle specific error patterns and make them user-friendly
      if (message.includes("insufficient funds")) {
        toast.error("💸 Insufficient Funds", {
          autoClose: 7000,
          onClose: () => {
            toast.info("💡 Try: Add more USDC, mint fewer tokens, or wait for lower gas fees", {
              autoClose: 5000,
            });
          }
        });
        return;
      } else if (message.includes("User denied") || message.includes("user rejected")) {
        toast.warn("🚫 Transaction Cancelled", {
          autoClose: 3000,
        });
        return;
      } else if (message.includes("execution reverted")) {
        // Try to extract revert reason
        const revertMatch = message.match(/execution reverted: (.+)/);
        if (revertMatch) {
          const revertReason = revertMatch[1];
          if (revertReason.includes("not whitelisted")) {
            toast.error("❌ Not Whitelisted", {
              autoClose: 5000,
              onClose: () => {
                toast.info("💡 Check if you're using the correct wallet address", {
                  autoClose: 4000,
                });
              }
            });
            return;
          } else if (revertReason.includes("sold out")) {
            toast.error("😢 Sold Out", {
              autoClose: 5000,
              onClose: () => {
                toast.info("💡 Try other available tokens or check back later", {
                  autoClose: 4000,
                });
              }
            });
            return;
          } else if (revertReason.includes("inactive")) {
            toast.error("⏸️ Minting Inactive", {
              autoClose: 5000,
            });
            return;
          }
          toast.error(`❌ Contract Error: ${revertReason}`, {
            autoClose: 5000,
          });
          return;
        }
        toast.error("❌ Transaction would fail due to contract conditions", {
          autoClose: 5000,
        });
        return;
      } else if (message.includes("gas limit") || message.includes("out of gas")) {
        toast.error("⛽ Gas Limit Issue", {
          autoClose: 7000,
          onClose: () => {
            toast.info("💡 Check minting requirements or try fewer tokens", {
              autoClose: 4000,
            });
          }
        });
        return;
      } else if (message.includes("network") || message.includes("connection")) {
        toast.error("🌐 Network Error", {
          autoClose: 5000,
          onClose: () => {
            toast.info("💡 Check your internet connection and try again", {
              autoClose: 4000,
            });
          }
        });
        return;
      }
      
      // Default error toast
      toast.error(`❌ ${message}`, {
        autoClose: 5000,
      });
      
    } catch (parseErrorException) {
      console.error("Error in showErrorToast:", parseErrorException);
      toast.error("An unexpected error occurred. Please try again.", {
        autoClose: 5000,
      });
    }
  }, []);

  // Utility function to show success toasts
  const showSuccessToast = useCallback((message, txHash = null, tokenId = null) => {
    toast.success(`🎉 ${message}`, {
      autoClose: 5000,
      onClick: () => {
        if (txHash) {
          // Open transaction in explorer using helper
          window.open(getTransactionUrl(txHash), '_blank');
        }
      }
    });
    
    if (txHash) {
      // Show a follow-up toast with transaction details
      setTimeout(() => {
        toast.info(
          `📋 Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)} (Click to view)`,
          {
            autoClose: 7000,
            onClick: () => {
              window.open(getTransactionUrl(txHash), '_blank');
            }
          }
        );
      }, 1000);
    }
  }, []);

  // Helper function to mint using Dynamic.xyz wallet client
  const mintWithDynamicWallet = async (tokenId, amount, useWhitelist = false) => {
    try {
      console.log("Available wallet methods:", Object.keys(primaryWallet));
      
      // Check if this is an EVM-compatible wallet
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        throw new Error("Please connect an EVM-compatible wallet (MetaMask, WalletConnect, etc.)");
      }

    const address = walletAddress;
    const token = tokens.find(t => t.id === tokenId);
    if (!token) {
      throw new Error(`Token with ID ${tokenId} not found`);
    }

    const priceStr = useWhitelist ? token.whitelistPrice : token.price;
    if (!priceStr) {
      throw new Error(`Price information for token #${tokenId} is not available`);
    }

    // Convert USDC price to wei format for transaction
    // USDC prices are in decimal format (e.g., "0.005"), so we need to convert to wei
    const price = ethers.utils.parseEther(priceStr);
    const amountBN = ethers.BigNumber.from(amount);
    const totalPrice = price.mul(amountBN);

    console.log(`Minting token #${tokenId}, amount: ${amount}, price: ${priceStr} USDC, total: ${totalPrice.toString()}`);

    // Create contract interface for encoding function calls
    const contractInterface = new ethers.utils.Interface(contractABI);
    
    let txData;
    if (useWhitelist) {
      // Fetch the Merkle proof for this address and token
      const proofData = await fetchWhitelistProof(address, tokenId);
      
      if (!proofData.isWhitelisted) {
        throw new Error("You are not whitelisted for this token.");
      }

      console.log("Encoding whitelist mint with proof:", proofData.proof);
      
      // Encode mintWhitelist function call
      txData = contractInterface.encodeFunctionData("mintWhitelist", [
        tokenId,
        amount,
        proofData.proof,
        address
      ]);
    } else {
      // Encode mint function call
      txData = contractInterface.encodeFunctionData("mint", [
        tokenId,
        amount,
        address
      ]);
    }

    try {
      // Get the wallet client from Dynamic.xyz
      console.log("Getting wallet client...");
      const walletClient = await primaryWallet.getWalletClient();
      console.log("Wallet client obtained:", walletClient);

      // Create transaction object
      const transaction = {
        to: CONTRACT_ADDRESS,
        value: totalPrice.toString(), // viem expects string, not hex
        data: txData,
      };

      console.log("Sending transaction with Dynamic wallet client:", transaction);
      
      // Use the wallet client's sendTransaction method
      const txHash = await walletClient.sendTransaction(transaction);
      console.log("Transaction sent, hash:", txHash);
      
      return { hash: txHash };

    } catch (error) {
      console.error("Error sending transaction:", error);
      
      // Parse and handle specific error types
      let friendlyMessage = "Transaction failed";
      
      if (error.message) {
        const msg = error.message.toLowerCase();
        
        // Insufficient funds
        if (msg.includes('insufficient funds') || msg.includes('exceeds the balance')) {
          friendlyMessage = "Insufficient funds - you don't have enough USDC to cover the transaction cost and gas fees";
        }
        // User rejected transaction
        else if (msg.includes('user rejected') || msg.includes('user denied')) {
          friendlyMessage = "Transaction was cancelled by user";
        }
        // Gas estimation failed
        else if (msg.includes('gas required exceeds allowance') || msg.includes('out of gas')) {
          friendlyMessage = "Transaction would fail due to gas limit - the contract may be rejecting this mint";
        }
        // Network issues
        else if (msg.includes('network') || msg.includes('connection')) {
          friendlyMessage = "Network connection issue - please check your internet and try again";
        }
        // Contract revert messages
        else if (msg.includes('revert') || msg.includes('execution reverted')) {
          if (msg.includes('not whitelisted')) {
            friendlyMessage = "You are not whitelisted for this token";
          } else if (msg.includes('mint not active')) {
            friendlyMessage = "Minting is not currently active for this token";
          } else if (msg.includes('sold out') || msg.includes('max supply')) {
            friendlyMessage = "This token is sold out";
          } else if (msg.includes('max mint')) {
            friendlyMessage = "You are trying to mint more than the maximum allowed per transaction";
          } else {
            friendlyMessage = "Contract rejected the transaction - please check minting requirements";
          }
        }
        // Fallback to original message for unknown errors
        else {
          friendlyMessage = error.message;
        }
      }
      
      // Show error toast instead of throwing
      showErrorToast(friendlyMessage, tokenId);
      return null;
    }
  } catch (outerError) {
    // Final safety net - should never reach here but prevents app crashes
    console.error("Unexpected error in mintWithDynamicWallet:", outerError);
    showErrorToast("An unexpected error occurred during minting. Please try again.", tokenId);
    return null;
  }
};

  // Set current year on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  // Debug logging for connection state
  useEffect(() => {
    console.log('Connection state changed:', { 
      isConnected, 
      hasWallet, 
      walletAddress, 
      isConnecting,
      networkChainId: network?.chainId,
      isBase: network?.isBase,
      primaryWallet: primaryWallet ? {
        address: primaryWallet.address,
        connector: primaryWallet.connector ? Object.keys(primaryWallet.connector) : null
      } : null
    });
  }, [isConnected, hasWallet, walletAddress, isConnecting, network, primaryWallet]);

  // Check if user is on correct network
  useEffect(() => {
    if (hasWallet && network && network.chainId) {
      const isSupported = network.isSupported;
      setIsCorrectNetwork(isSupported);
      
      if (!isSupported) {
        setShowNetworkModal(true);
      }
    } else if (hasWallet && network && !network.chainId) {
      // Network data is incomplete, don't show modal yet
      console.log('Network data incomplete:', network);
    }
  }, [hasWallet, network]);

  // Fetch whitelist status when wallet connects
  useEffect(() => {
    const checkWhitelist = async () => {
      if (!hasWallet || !walletAddress) {
        setWhitelistStatus(null);
        return;
      }
      
      try {
        console.log("Checking whitelist for address:", walletAddress);
        
        const response = await fetch(`/api/whitelist?address=${walletAddress}`);
        
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
  }, [hasWallet, walletAddress]);

  // Helper function to fetch only dynamic data (minted counts) from blockchain using RPC
  const fetchLiveTokenCounts = useCallback(async (tokenIds = null, currentTokens = null) => {
    try {
      console.log('🔄 Fetching live token counts from blockchain...');
      
      if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || !process.env.NEXT_PUBLIC_RPC_URL) {
        throw new Error('Missing contract configuration');
      }

      // Create provider using RPC endpoint (no wallet needed for reading)
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      
      // Create contract instance for reading
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractABI,
        provider
      );

      // Get token IDs to update (either specific ones or all active tokens)
      let targetTokenIds;
      if (tokenIds) {
        targetTokenIds = tokenIds;
      } else if (currentTokens && currentTokens.length > 0) {
        targetTokenIds = currentTokens.filter(t => t.mintingActive || t.isAvailable).map(t => t.id);
      } else {
        // Default to common token IDs if no tokens available
        targetTokenIds = [0, 1, 2];
      }
      
      const updatedCounts = {};
      
      // Fetch current counts for each token
      for (const tokenId of targetTokenIds) {
        try {
          // Fetch both token config and unminted supply
          const [tokenConfig, unmintedSupply] = await Promise.all([
            contract.tokenConfigs(tokenId),
            contract.getUnmintedSupply(tokenId).catch(() => null) // Some contracts might not have this
          ]);
          
          const minted = parseInt(tokenConfig.minted.toString());
          const maxSupply = parseInt(tokenConfig.maxSupply.toString());
          const unlimited = tokenConfig.unlimited || maxSupply === 0;
          const unminted = unlimited ? null : (unmintedSupply ? parseInt(unmintedSupply.toString()) : maxSupply - minted);
          
          updatedCounts[tokenId] = {
            minted,
            maxSupply: unlimited ? null : maxSupply,
            unminted,
            unlimited,
            mintingActive: tokenConfig.mintingActive,
            isWhitelistActive: tokenConfig.isWhitelistActive,
            mintedPercentage: unlimited ? 0 : Math.floor((minted / maxSupply) * 100),
            isSoldOut: unlimited ? false : minted >= maxSupply,
            lastUpdated: Date.now()
          };
          
          console.log(`✅ Token ${tokenId}: ${minted}/${unlimited ? '∞' : maxSupply} minted (${unlimited ? 'unlimited' : `${unminted}`})`);
        } catch (error) {
          console.error(`❌ Failed to fetch data for token ${tokenId}:`, error);
        }
      }

      return updatedCounts;
      
    } catch (error) {
      console.error('❌ Failed to fetch live token counts:', error);
      return {};
    }
  }, []);

  // Function to merge live counts with existing token data
  const updateTokensWithLiveCounts = useCallback((liveCounts, currentTokens) => {
    if (!currentTokens || Object.keys(liveCounts).length === 0) return currentTokens;
    
    return currentTokens.map(token => {
      const liveData = liveCounts[token.id];
      if (liveData) {
        return {
          ...token,
          ...liveData,
          // Update display values
          maxSupplyDisplay: liveData.unlimited ? "∞" : liveData.maxSupply.toString(),
          unmintedDisplay: liveData.unlimited ? "Unlimited" : liveData.unminted.toString(),
          isAvailable: token.mintingActive && !liveData.isSoldOut,
        };
      }
      return token; // Keep existing token data (including any previous live data)
    });
  }, []);

  // State to hold tokens with live data
  const [tokensWithLiveData, setTokensWithLiveData] = useState([]);
  
  // Loading state for live count fetching
  const [isRefreshingCounts, setIsRefreshingCounts] = useState(false);

  // Update tokens with live data when base tokens change
  useEffect(() => {
    setTokensWithLiveData(tokens);
  }, [tokens]);

  // Track if we've done the initial fetch
  const initialFetchDone = useRef(false);
  
  // Keep a ref to the current tokens to avoid dependency issues
  const tokensRef = useRef(tokens);
  
  // Update the ref when tokens change
  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  // Fetch live counts when component mounts (no wallet needed)
  useEffect(() => {
    if (tokens && tokens.length > 0 && !initialFetchDone.current) {
      console.log('🔄 Fetching initial live token counts...');
      initialFetchDone.current = true;
      refreshTokenCounts(null, true).catch(error => {
        console.error('❌ Failed to fetch initial live counts:', error);
      });
    }
  }, [tokens.length]); // Only run when we first have tokens

  // Optional: Periodically refresh counts (every 60 seconds)
  useEffect(() => {
    if (!tokens || tokens.length === 0) return;

    const interval = setInterval(() => {
      console.log('🔄 Periodic refresh of token counts...');
      refreshTokenCounts(null, false).catch(error => {
        console.error('❌ Periodic refresh failed:', error);
      });
    }, 60000); // 60 seconds (less frequent)

    return () => clearInterval(interval);
  }, [tokens.length]); // Only depend on whether we have tokens

  // Enhanced refresh function that only updates dynamic data
  const refreshTokenCounts = useCallback(async (specificTokenIds = null, showLoading = false) => {
    try {
      console.log('🔄 Refreshing token counts...');
      
      if (showLoading) {
        setIsRefreshingCounts(true);
      }
      
      // Use functional update to get current tokens
      return new Promise((resolve, reject) => {
        setTokensWithLiveData(currentTokens => {
          // Use current tokens to fetch live counts
          const currentTokensToUse = currentTokens.length > 0 ? currentTokens : tokensRef.current;
          
          fetchLiveTokenCounts(specificTokenIds, currentTokensToUse)
            .then(liveCounts => {
              if (Object.keys(liveCounts).length > 0) {
                // Merge with existing token data
                const updatedTokens = updateTokensWithLiveCounts(liveCounts, currentTokensToUse);
                setTokensWithLiveData(updatedTokens);
                
                console.log('✅ Token counts updated:', Object.keys(liveCounts));
                resolve(liveCounts);
              } else {
                resolve({});
              }
            })
            .catch(error => {
              console.error('❌ Token count refresh failed:', error);
              reject(error);
            })
            .finally(() => {
              if (showLoading) {
                setIsRefreshingCounts(false);
              }
            });
          
          return currentTokens; // Return current tokens unchanged
        });
      });
      
    } catch (error) {
      console.error('❌ Token count refresh failed:', error);
      if (showLoading) {
        setIsRefreshingCounts(false);
      }
      throw error;
    }
  }, [fetchLiveTokenCounts]);

  // Manual refresh function for the refresh button
  const handleManualRefresh = useCallback(async () => {
    try {
      console.log('🔄 Manual refresh triggered...');
      
      // Show loading toast
      toast.info("🔄 Refreshing token counts...", {
        autoClose: 2000,
      });
      
      // Refresh with loading state
      await refreshTokenCounts(null, true);
      
      toast.success("✅ Token counts refreshed!", {
        autoClose: 2000,
      });
      
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      toast.error("❌ Failed to refresh token counts", {
        autoClose: 3000,
      });
    }
  }, [refreshTokenCounts]);

  const handleSwitchNetwork = async (targetNetwork) => {
    try {
      console.log("Switching to network:", targetNetwork);
      
      // Show loading toast
      toast.info("🔄 Switching network...", {
        autoClose: 2000,
      });
      
      // Use Dynamic's switchNetwork function
      if (targetNetwork.chainId === CURRENT_NETWORK.chainId) {
        await switchToCurrentNetwork();
        toast.success(`✅ Switched to ${CURRENT_NETWORK.displayName}`, {
          autoClose: 3000,
        });
      } else {
        await switchToNetwork(targetNetwork.chainId);
        toast.success(`✅ Switched to ${targetNetwork.name}`, {
          autoClose: 3000,
        });
      }
      
      // Close the modal after switching
      setShowNetworkModal(false);
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast.error("❌ Failed to switch network. Please try manually in your wallet.", {
        autoClose: 5000,
      });
      // Still close the modal even if switching fails
      setShowNetworkModal(false);
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

  // Update the handleMint function to work with Dynamic WaaS
  const handleMint = async (tokenId, amount, useWhitelist = false) => {
    if (!hasWallet || !walletAddress) {
      showErrorToast("Please connect your wallet first", tokenId);
      return;
    }
    
    // Set loading state for this specific token
    setTokenMinting(tokenId, true);
    
    try {
      // Use Dynamic wallet helper function - it handles errors via toasts now
      const txResponse = await mintWithDynamicWallet(tokenId, amount, useWhitelist);
      
      // If txResponse is null, an error occurred and was already shown via toast
      if (!txResponse || !txResponse.hash) {
        return; // Exit early, error already handled
      }
      
      // Transaction hash is returned directly
      console.log("Transaction submitted:", txResponse.hash);
      
      // Show success toast
      showSuccessToast(
        `Successfully minted ${amount}x Token #${tokenId}!`, 
        txResponse.hash, 
        tokenId
      );
      
      // Show mint success popup
      setShowMintSuccessPopup(true);
      
      // Show immediate feedback that counts are being updated
      toast.info("🔄 Updating token counts...", {
        autoClose: 2000,
      });
      
      // Refresh all token counts to maintain consistency
      try {
        // Wait a moment for blockchain to update
        setTimeout(async () => {
          await refreshTokenCounts(null, false); // Refresh all tokens, not just the minted one
          toast.success("✅ Token counts updated!", {
            autoClose: 2000,
          });
        }, 3000);
        
      } catch (refreshError) {
        console.error("Failed to refresh counts:", refreshError);
        // Show a warning toast but don't fail the mint
        toast.warn("🔄 Mint successful but count refresh failed. Please refresh to see updated counts.", {
          autoClose: 6000,
        });
      }
      
    } catch (err) {
      // This should rarely happen now since mintWithDynamicWallet handles its own errors
      console.error("Unexpected error in handleMint:", err);
      showErrorToast("An unexpected error occurred", tokenId);
      
    } finally {
      // Always clear loading state, even if errors occur
      try {
        setTokenMinting(tokenId, false);
      } catch (finallyError) {
        console.error("Failed to clear loading state:", finallyError);
      }
    }
  };
  
  // Also update the batch mint function to work with Dynamic wallet
  const handleBatchMint = async (tokenId, amount, useWhitelist) => {
    if (!hasWallet || !walletAddress) {
      showErrorToast("Please connect your wallet first", tokenId);
      return null; // Return null to indicate failure
    }
    
    // Set loading state for this token
    setTokenMinting(tokenId, true);
    
    try {
      // Use Dynamic wallet helper function - it handles errors via toasts now
      const txResponse = await mintWithDynamicWallet(tokenId, amount, useWhitelist);
      
      // If txResponse is null, an error occurred and was already shown via toast
      if (!txResponse || !txResponse.hash) {
        return null; // Return null to indicate failure
      }
      
      // Transaction hash is returned directly
      console.log("Batch mint transaction submitted:", txResponse.hash);
      
      // Show success toast
      showSuccessToast(
        `Successfully batch minted ${amount}x Token #${tokenId}!`, 
        txResponse.hash, 
        tokenId
      );
      
      // Remove from cart after successful mint
      removeFromCart(tokenId);
      
      // Show immediate feedback that counts are being updated
      toast.info("🔄 Updating token counts...", {
        autoClose: 2000,
      });
      
      // Refresh all token counts to maintain consistency
      try {
        // Wait a moment for blockchain to update
        setTimeout(async () => {
          await refreshTokenCounts(null, false); // Refresh all tokens, not just the minted one
          toast.success("✅ Token counts updated!", {
            autoClose: 2000,
          });
        }, 3000);
        
      } catch (refreshError) {
        console.error("Failed to refresh counts:", refreshError);
        toast.warn("🔄 Mint successful but count refresh failed. Please refresh to see updated counts.", {
          autoClose: 6000,
        });
      }
      
      return txResponse;
      
    } catch (err) {
      // This should rarely happen now since mintWithDynamicWallet handles its own errors
      console.error("Unexpected error in handleBatchMint:", err);
      showErrorToast("An unexpected error occurred", tokenId);
      return null;
    } finally {
      // Clear loading state
      setTokenMinting(tokenId, false);
    }
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Helper function to get token name by ID
  const getTokenName = (tokenId) => {
    const token = tokensWithLiveData.find(t => t.id === tokenId);
    return token?.name || `Token #${tokenId}`;
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

  const currentNetwork = network ? {
    chainId: network.chainId,
    name: network.label,
    explorerUrl: SUPPORTED_NETWORKS[network.chainId]?.blockExplorerUrl
  } : null;

  // Collection configurations
  const collectionConfigs = {
    "sticker-collection": {
      name: "Sticker Collection",
                      description: "Exclusive digital stickers for the FanSpark's community",
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
    <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border/50 bg-gradient-to-br from-accent/10 to-accent/5">
      {/* Campaign Banner Background */}
      <div className="absolute inset-0 bg-[url('/first_campaign_banner.png')] bg-cover bg-center opacity-30"></div>
      
      {/* Black Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      
      <div className="relative container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 text-xs bg-background/50 backdrop-blur-sm border-border/30">
            <Sparkles className="w-3 h-3 mr-2 text-primary" />
            Verified on-chain authenticity
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
            Spark This Campaign Today!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            The Stellar Comet is the first issue in a brand-new sci-fi fantasy comic series set on a reimagined Mars: a lush, mysterious world where ancient magic collides with cosmic destiny
          </p>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              {(() => {
                // Debug: Log current state for hero button
                console.log('Hero button logic:', {
                  isConnected,
                  hasWallet,
                  network,
                  networkChainId: network?.chainId,
                  isCurrentNetwork: network?.isCurrentNetwork,
                  shouldShowSwitch: hasWallet && network && network.chainId !== CURRENT_NETWORK.chainId
                });
                
                if (!isConnected) {
                  return (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg px-6 py-2 text-base font-semibold"
                      onClick={openConnectionModal}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect to Spark
                    </Button>
                  );
                } else if (hasWallet && network && network.chainId && network.chainId !== CURRENT_NETWORK.chainId) {
                  return (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg px-6 py-2 text-base font-semibold"
                      onClick={switchToCurrentNetwork}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Switch to {CURRENT_NETWORK.displayName}
                    </Button>
                  );
                } else {
                  return (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg px-6 py-2 text-base font-semibold"
                      onClick={() => {
                        document.getElementById('tokens-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Start Collecting
                    </Button>
                  );
                }
              })()}
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Join our growing community of fans in the FanSpark ecosystem
            </p>
            
          </div>
        </div>
      </div>
      
      {/* Full Width Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <div className="container mx-auto">
          <div className="w-full bg-black/20 backdrop-blur-sm rounded-full h-2 mb-2">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{
                width: `${(() => {
                  const totalRaised = tokensWithLiveData.reduce((sum, token) => {
                    const price = parseFloat(token.price) || 0;
                    const minted = token.minted || 0;
                    return sum + (price * minted);
                  }, 0);
                  const totalGoal = tokensWithLiveData.reduce((sum, token) => {
                    const price = parseFloat(token.price) || 0;
                    const supply = token.unlimited ? 1000 : token.maxSupply || 0;
                    return sum + (price * supply);
                  }, 0);
                  return totalGoal > 0 ? Math.floor((totalRaised / totalGoal) * 100) : 0;
                })()}%`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-white/70">
            <span>
              {(() => {
                const totalRaised = tokensWithLiveData.reduce((sum, token) => {
                  const price = parseFloat(token.price) || 0;
                  const minted = token.minted || 0;
                  return sum + (price * minted);
                }, 0);
                return totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              })()} USDC raised
            </span>
            <span>
              {(() => {
                const totalGoal = tokensWithLiveData.reduce((sum, token) => {
                  const price = parseFloat(token.price) || 0;
                  const supply = token.unlimited ? 1000 : token.maxSupply || 0;
                  return sum + (price * supply);
                }, 0);
                return totalGoal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              })()} USDC goal
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pr-6 lg:pr-8">
      {/* Welcome Popup */}
      <WelcomePopup />
      
      {dataError ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{dataError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshContractData}
              disabled={isDataLoading}
              className="ml-4"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isDataLoading ? 'animate-spin' : ''}`} />
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
              {/* Sync Indicator */}
              <SyncIndicator
                pendingRefresh={isRefreshingCounts}
                onManualSync={handleManualRefresh}
              />
              
              
              <CartButton 
                cartItemCount={getTotalCartItems()}
                onClick={() => setIsCartOpen(true)}
              />
            </div>
          </div>

          <Separator />

          {/* Tokens Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokensWithLiveData.filter(token => token.mintingActive).map(token => (
              <ErrorBoundary key={token.id}>
                <TokenCard 
                  token={token}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  isInCart={isInCart(token.id)}
                  cartQuantity={getCartQuantity(token.id)}
                  whitelistStatus={whitelistStatus}
                  onMint={handleMint}
                  walletConnected={isConnected}
                  hasWallet={hasWallet}
                  isCorrectNetwork={isCorrectNetwork}
                  wallet={primaryWallet}
                  network={network}
                  isMinting={isTokenMinting(token.id)}
                  isRefreshingCounts={isRefreshingCounts}
                />
              </ErrorBoundary>
            ))}
          </div>

          {/* Data Age Warning
          {isDataStale() && (
            <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-amber-600">
                Contract data is {getDataAge()} old. Consider running the fetch script to get latest data.
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2 text-amber-600" 
                  onClick={refreshContractData}
                >
                  Refresh now
                </Button>
              </AlertDescription>
            </Alert>
          )} */}

          {/* Error Display */}
          {dataError && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-600">
                {dataError}
                <div className="mt-2 text-sm">
                  Try running: <code className="bg-gray-800 px-2 py-1 rounded">npm run fetch-contract-data</code>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {(isDataLoading || (isRefreshingCounts && tokensWithLiveData.length === 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
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
          {!isDataLoading && tokensWithLiveData.length === 0 && !dataError && (
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
                                  <h4 className="font-medium truncate">{getTokenName(item.tokenId)}</h4>
                                  {item.useWhitelist && (
                                    <Badge variant="outline" size="sm" className="text-xs">
                                      WL
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {(item.useWhitelist ? item.whitelistPrice : item.price)} USDC each
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
                            }, 0).toFixed(6)} USDC
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2">
                          <Button 
                            onClick={() => setShowBatchMintModal(true)}
                            disabled={!hasWallet || !isCorrectNetwork}
                            className="w-full"
                            size="lg"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            {!hasWallet ? "Connect Wallet" : !isCorrectNetwork ? "Wrong Network" : "Pay with Crypto"}
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
        onBatchMint={handleBatchMint}
        walletConnected={hasWallet}
        isCorrectNetwork={isCorrectNetwork}
        wallet={primaryWallet}
        onBatchComplete={() => setShowMintSuccessPopup(true)}
      />

      <NetworkModal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onSwitchNetwork={handleSwitchNetwork}
        supportedNetworks={[
          {
            chainId: CURRENT_NETWORK.chainId,
            name: CURRENT_NETWORK.displayName,
            explorerUrl: CURRENT_NETWORK.blockExplorerUrl
          }
        ]}
        currentNetwork={network ? {
          chainId: network.chainId,
          name: network.name,
          explorerUrl: CURRENT_NETWORK.blockExplorerUrl
        } : null}
      />

      <MintSuccessPopup
        isVisible={showMintSuccessPopup}
        onClose={() => setShowMintSuccessPopup(false)}
      />

      {/* Footer */}
      <footer className="border-t py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{BRAND_CONFIG.name} · {CURRENT_NETWORK.displayName} · {currentYear}</p>
        </div>
      </footer>
    </div>
  );
}