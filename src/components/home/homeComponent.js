"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import contractABI from "@/utils/contractABI.json";
import TokenCard from "@/components/TokenCard";
import BatchMintModal from "@/components/BatchMintModal";
import NetworkModal from "@/components/NetworkModal";
import { formatEther } from "ethers/lib/utils";
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK, getNetworkById } from "@/utils/networkConfig";
import Cart from '@/components/Cart';
import { useCart } from '@/components/CartProvider';

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
  const { cart, addToCart, getCartQuantity, isInCart } = useCart();

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

  // Create a memoized fetch function to avoid recreating it on each render
  const fetchTokenInfo = useCallback(async () => {
    if (!wallet || !isCorrectNetwork) return;
    
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(wallet.provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      
      const tokenInfos = [];
      for (let i = 0; i < 10; i++) {
        const config = await contract.tokenConfigs(i);
        const unminted = await contract.getUnmintedSupply(i);
        
        // Add debug logging
        console.log(`Token #${i} config:`, {
          price: formatEther(config.price),
          whitelistPrice: formatEther(config.whitelistPrice),
          isWhitelistActive: config.isWhitelistActive,
          mintingActive: config.mintingActive
        });
        
        tokenInfos.push({
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
        });
      }
      
      setTokens(tokenInfos);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching token data:", err);
      setError("Failed to load token data. Please check your connection and try again.");
      setIsLoading(false);
    }
  }, [wallet, CONTRACT_ADDRESS, isCorrectNetwork]);

  // Fetch token data when wallet is connected and on correct network
  useEffect(() => {
    if (wallet && isCorrectNetwork) {
      fetchTokenInfo();
    }
  }, [wallet, isCorrectNetwork, fetchTokenInfo]);

  const handleSwitchNetwork = async (networkId) => {
    const network = getNetworkById(networkId);
    if (!network) return;
    
    const success = await setChain({ chainId: network.id });
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
      
      const token = tokens.find(t => t.id === tokenId);
      const price = useWhitelist 
        ? ethers.utils.parseEther(token.whitelistPrice)
        : ethers.utils.parseEther(token.price);
        
      const totalPrice = price.mul(amount);
      
      // Call the appropriate mint function based on whitelist status
      let tx;
      if (useWhitelist) {
        // Fetch the Merkle proof for this address and token
        const address = wallet.accounts[0].address;
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
          { value: totalPrice }
        );
      } else {
        tx = await contract.mint(tokenId, amount, {
          value: totalPrice
        });
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
  const handleBatchMint = async (selectedTokens) => {
    if (!wallet) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(wallet.provider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const address = wallet.accounts[0].address;
      
      // Group by whether they're using whitelist or not
      const whitelistTokens = selectedTokens.filter(token => token.useWhitelist);
      const regularTokens = selectedTokens.filter(token => !token.useWhitelist);
      
      // Handle whitelist tokens first if there are any
      if (whitelistTokens.length > 0) {
        // Process each whitelist token individually since they need different proofs
        for (const item of whitelistTokens) {
          const token = tokens.find(t => t.id === item.tokenId);
          const price = ethers.utils.parseEther(token.whitelistPrice);
          const totalPrice = price.mul(item.amount);
          
          // Fetch the proof for this specific token
          const proofData = await fetchWhitelistProof(address, item.tokenId);
          
          if (!proofData.isWhitelisted) {
            alert(`You are not whitelisted for token #${item.tokenId}. Skipping.`);
            continue;
          }
          
          const tx = await contract.mintWhitelist(
            item.tokenId, 
            item.amount, 
            proofData.proof,
            { value: totalPrice }
          );
          
          await tx.wait();
          alert(`Successfully minted whitelisted token #${item.tokenId}!`);
        }
      }
      
      // Then handle regular tokens if there are any
      if (regularTokens.length > 0) {
        const tokenIds = [];
        const amounts = [];
        let totalPrice = ethers.BigNumber.from("0");
        
        regularTokens.forEach(item => {
          const token = tokens.find(t => t.id === item.tokenId);
          tokenIds.push(item.tokenId);
          amounts.push(item.amount);
          const price = ethers.utils.parseEther(token.price);
          totalPrice = totalPrice.add(price.mul(item.amount));
        });
        
        if (tokenIds.length > 0) {
          const tx = await contract.batchMint(tokenIds, amounts, {
            value: totalPrice
          });
          
          await tx.wait();
          alert(`Successfully minted ${regularTokens.length} token types!`);
        }
      }
      
      // Refresh the token data after minting
      await fetchTokenInfo();
      
      // Close the modal
      setShowBatchMintModal(false);
      
    } catch (err) {
      console.error("Error batch minting tokens:", err);
      alert(`Error batch minting tokens: ${err.message || err}`);
    }
  };

  // Client-side only rendering
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white font-sans flex flex-col items-center justify-center">
      {/* Minimalist Main Content - perfect for iframe */}
      <main className="w-full max-w-5xl p-5">
        {isLoading && wallet && isCorrectNetwork ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative h-20 w-20 group">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin group-hover:border-cyan-400 transition-colors"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-pink-500 animate-spin-slow group-hover:border-pink-400 transition-colors"></div>
              <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin-slower group-hover:border-purple-400 transition-colors"></div>
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400 pulse"></div>
              </div>
            </div>
            <p className="mt-4 text-cyan-300/70">Loading tokens...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-8 bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg">{error}</p>
          </div>
        ) : !wallet ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-20 w-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-4">
              RewardCrate Tokens
            </h1>
            <p className="text-cyan-100/70 text-center max-w-md mb-8">
              Connect your wallet to mint exclusive ERC1155 tokens from the RewardCrate collection on Base network
            </p>
            <button
              onClick={() => connect()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-10 rounded-md transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 hover-glow"
              disabled={connecting}
            >
              {connecting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="text-center p-10 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-pink-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <p className="text-xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Network Switch Required</p>
            <p className="text-base mb-6 text-purple-100/70">Please connect to Base network to access the RewardCrate collection</p>
            <button 
              onClick={() => setShowNetworkModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-md transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
            >
              Switch Network
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Available Tokens
              </h2>
              <div className="flex items-center gap-4">
                {/* Show whitelist status */}
                {whitelistStatus && whitelistStatus.isWhitelisted && (
                  <div className="text-sm bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-3 py-1 rounded border border-yellow-500/20 text-yellow-300">
                    <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    Whitelisted
                  </div>
                )}
                <button
                  onClick={() => setShowBatchMintModal(true)}
                  className="text-cyan-300 hover:text-cyan-200 text-sm font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Batch Mint
                </button>
                <button
                  onClick={() => disconnect({ label: wallet.label })}
                  className="text-red-300 hover:text-red-200 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tokens.map(token => (
                <TokenCard 
                  key={token.id} 
                  token={token} 
                  onMint={handleMint} 
                  walletConnected={!!wallet}
                  address={wallet?.accounts[0]?.address}
                  whitelistStatus={whitelistStatus}
                  onAddToCart={addToCart}
                  isInCart={isInCart(token.id)}
                  cartQuantity={getCartQuantity(token.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {showBatchMintModal && (
        <BatchMintModal 
          tokens={tokens.filter(token => token.mintingActive)}
          onClose={() => setShowBatchMintModal(false)}
          onBatchMint={handleBatchMint}
          whitelistStatus={whitelistStatus}
        />
      )}

      {showNetworkModal && (
        <NetworkModal 
          currentChainId={connectedChain?.id}
          onClose={() => setShowNetworkModal(false)}
          onSwitchNetwork={handleSwitchNetwork}
        />
      )}

      {/* Small footer with attribution */}
      <footer className="w-full text-center text-xs text-cyan-100/20 py-3">
        <span>RewardCrate ERC1155 · Base Network · {currentYear}</span>
      </footer>

      {/* Cart Button */}
      <div className="fixed top-4 right-4 z-40">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 bg-slate-800/90 rounded-full text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart 
          onBatchMint={handleBatchMint}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
