"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCallback } from "react";

export function useDynamicWallet() {
  const {
    handleConnect,
    handleDisconnect,
    user,
    primaryWallet,
    isConnecting,
    isInitialized,
    isAuthenticated,
    network,
    setNetwork,
    switchNetwork,
    walletConnector,
    walletConnectorError,
    setShowAuthFlow,
  } = useDynamicContext();

  // Debug logging
  console.log('Dynamic Context State:', {
    isAuthenticated,
    user: !!user,
    primaryWallet: !!primaryWallet,
    primaryWalletAddress: primaryWallet?.address,
    network: network?.chainId,
    isConnecting,
    isInitialized
  });

  const connect = useCallback(async () => {
    try {
      if (typeof handleConnect === 'function') {
        await handleConnect();
      } else {
        console.warn('handleConnect is not available');
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }, [handleConnect]);

  const openConnectionModal = useCallback(() => {
    if (typeof setShowAuthFlow === 'function') {
      setShowAuthFlow(true);
    } else {
      console.error('Cannot open Dynamic modal, setShowAuthFlow is not a function.');
    }
  }, [setShowAuthFlow]);

  const disconnect = useCallback(async () => {
    try {
      if (typeof handleDisconnect === 'function') {
        await handleDisconnect();
      } else {
        console.warn('handleDisconnect is not available');
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      throw error;
    }
  }, [handleDisconnect]);

  const getWalletAddress = useCallback(() => {
    return primaryWallet?.address || null;
  }, [primaryWallet]);

  const getWalletProvider = useCallback(() => {
    return primaryWallet?.connector?.provider || null;
  }, [primaryWallet]);

  const isConnected = isAuthenticated || !!user;

  const hasWallet = !!primaryWallet;

  const getNetworkInfo = useCallback(() => {
    if (!network) return null;
    
    return {
      chainId: network.chainId,
      name: network.name,
      isSupported: network.chainId === 8453 || network.chainId === 1, // Base or Ethereum
      isBase: network.chainId === 8453,
      isEthereum: network.chainId === 1,
    };
  }, [network]);

  const switchToBase = useCallback(async () => {
    try {
      if (typeof switchNetwork === 'function') {
        await switchNetwork({ networkChainId: 8453 });
      } else {
        console.warn('switchNetwork is not available');
      }
    } catch (error) {
      console.error("Failed to switch to Base network:", error);
      throw error;
    }
  }, [switchNetwork]);

  const switchToEthereum = useCallback(async () => {
    try {
      if (typeof switchNetwork === 'function') {
        await switchNetwork({ networkChainId: 1 });
      } else {
        console.warn('switchNetwork is not available');
      }
    } catch (error) {
      console.error("Failed to switch to Ethereum network:", error);
      throw error;
    }
  }, [switchNetwork]);

  return {
    // Connection state
    isConnected,
    hasWallet,
    isConnecting,
    isInitialized,
    isAuthenticated,
    
    // User and wallet info
    user,
    primaryWallet,
    walletAddress: getWalletAddress(),
    walletProvider: getWalletProvider(),
    
    // Network info
    network: getNetworkInfo(),
    
    // Actions
    connect,
    disconnect,
    switchNetwork,
    setNetwork,
    openConnectionModal,
    switchToBase,
    switchToEthereum,
    
    // Error handling
    walletConnectorError,
    
    // Raw context (for advanced usage)
    dynamicContext: {
      handleConnect,
      handleDisconnect,
      network,
      walletConnector,
    },
  };
} 