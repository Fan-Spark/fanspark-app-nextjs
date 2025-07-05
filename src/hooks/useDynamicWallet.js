"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCallback, useState, useEffect } from "react";
import { CURRENT_NETWORK } from "@/utils/networkConfig";

export function useDynamicWallet() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get context safely
  let contextData = null;
  try {
    contextData = useDynamicContext();
  } catch (error) {
    console.error("Error accessing Dynamic context:", error);
  }

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
  } = contextData || {};

  // Debug logging - only when mounted
  useEffect(() => {
    if (mounted && contextData) {
      console.log('Dynamic Context State:', {
        isAuthenticated,
        user: !!user,
        primaryWallet: !!primaryWallet,
        primaryWalletAddress: primaryWallet?.address,
        network: network?.chainId,
        isConnecting,
        isInitialized
      });
    }
  }, [mounted, contextData, isAuthenticated, user, primaryWallet, network, isConnecting, isInitialized]);

  const connect = useCallback(async () => {
    if (!mounted || !handleConnect) return;
    
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
  }, [handleConnect, mounted]);

  const openConnectionModal = useCallback(() => {
    if (!mounted || !setShowAuthFlow) return;
    
    if (typeof setShowAuthFlow === 'function') {
      setShowAuthFlow(true);
    } else {
      console.error('Cannot open Dynamic modal, setShowAuthFlow is not a function.');
    }
  }, [setShowAuthFlow, mounted]);

  const disconnect = useCallback(async () => {
    if (!mounted || !handleDisconnect) return;
    
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
  }, [handleDisconnect, mounted]);

  const getWalletAddress = useCallback(() => {
    return primaryWallet?.address || null;
  }, [primaryWallet]);

  const getWalletProvider = useCallback(() => {
    return primaryWallet?.connector?.provider || null;
  }, [primaryWallet]);

  const isConnected = mounted && (isAuthenticated || !!user);
  const hasWallet = mounted && !!primaryWallet;

  const getNetworkInfo = useCallback(() => {
    if (!mounted || !network) return null;
    
    return {
      chainId: network.chainId,
      name: network.name,
      isSupported: network.chainId === CURRENT_NETWORK.chainId,
      isCurrentNetwork: network.chainId === CURRENT_NETWORK.chainId,
      label: network.chainId === CURRENT_NETWORK.chainId ? CURRENT_NETWORK.displayName : network.name,
    };
  }, [network, mounted]);

  const switchToCurrentNetwork = useCallback(async () => {
    if (!mounted || !switchNetwork) return;
    
    try {
      if (typeof switchNetwork === 'function') {
        await switchNetwork({ networkChainId: CURRENT_NETWORK.chainId });
      } else {
        console.warn('switchNetwork is not available');
      }
    } catch (error) {
      console.error(`Failed to switch to ${CURRENT_NETWORK.name} network:`, error);
      throw error;
    }
  }, [switchNetwork, mounted]);

  // Generic network switch function
  const switchToNetwork = useCallback(async (chainId) => {
    if (!mounted || !switchNetwork) return;
    
    try {
      if (typeof switchNetwork === 'function') {
        await switchNetwork({ networkChainId: chainId });
      } else {
        console.warn('switchNetwork is not available');
      }
    } catch (error) {
      console.error(`Failed to switch to network ${chainId}:`, error);
      throw error;
    }
  }, [switchNetwork, mounted]);

  // Return safe defaults when not mounted or context unavailable
  if (!mounted || !contextData) {
    return {
      // Connection state
      isConnected: false,
      hasWallet: false,
      isConnecting: false,
      isInitialized: false,
      isAuthenticated: false,
      
      // User and wallet info
      user: null,
      primaryWallet: null,
      walletAddress: null,
      walletProvider: null,
      
      // Network info
      network: null,
      
      // Actions (no-ops when not mounted)
      connect: async () => {},
      disconnect: async () => {},
      switchNetwork: async () => {},
      setNetwork: () => {},
      openConnectionModal: () => {},
      switchToCurrentNetwork: async () => {},
      switchToNetwork: async () => {},
      
      // Error handling
      walletConnectorError: null,
      
      // Raw context (empty when not available)
      dynamicContext: {},
    };
  }

  return {
    // Connection state
    isConnected,
    hasWallet,
    isConnecting: isConnecting || false,
    isInitialized: isInitialized || false,
    isAuthenticated: isAuthenticated || false,
    
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
    switchToCurrentNetwork,
    switchToNetwork,
    
    // Legacy support for backward compatibility
    switchToBase: switchToCurrentNetwork,
    switchToEthereum: switchToNetwork.bind(null, 1),
    
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