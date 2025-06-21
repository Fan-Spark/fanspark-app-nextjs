import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useContractData } from './useContractData';
import contractABI from '@/utils/contractABI.json';

// Enhanced hook that adds real-time sync capabilities
export function useContractDataSync() {
  const baseHook = useContractData();
  const [isListening, setIsListening] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const providerRef = useRef(null);
  const contractRef = useRef(null);
  const listenersRef = useRef([]);

  // Initialize provider and contract for event listening
  const initializeEventListening = useCallback(async () => {
    try {
      if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || !process.env.NEXT_PUBLIC_RPC_URL) {
        console.warn('Missing contract address or RPC URL for event listening');
        return;
      }

      // Create provider for event listening
      providerRef.current = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );

      // Create contract instance
      contractRef.current = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractABI,
        providerRef.current
      );

      console.log('🎧 Event listening initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize event listening:', error);
      return false;
    }
  }, []);

  // Start listening for mint events
  const startEventListening = useCallback(async () => {
    if (isListening || !contractRef.current) return;

    try {
      const contract = contractRef.current;
      
      // Listen for Transfer events (ERC1155 mints)
      const transferFilter = contract.filters.TransferSingle(null, ethers.constants.AddressZero, null, null, null);
      const batchTransferFilter = contract.filters.TransferBatch(null, ethers.constants.AddressZero, null, null, null);

      const handleMintEvent = (operator, from, to, id, value, event) => {
        console.log('🔥 Mint detected!', {
          tokenId: id.toString(),
          amount: value.toString(),
          to,
          txHash: event.transactionHash
        });

        // Trigger refresh after a short delay (to ensure blockchain state is updated)
        setTimeout(() => {
          setPendingRefresh(true);
        }, 2000);
      };

      const handleBatchMintEvent = (operator, from, to, ids, values, event) => {
        console.log('🔥 Batch mint detected!', {
          tokenIds: ids.map(id => id.toString()),
          amounts: values.map(v => v.toString()),
          to,
          txHash: event.transactionHash
        });

        setTimeout(() => {
          setPendingRefresh(true);
        }, 2000);
      };

      // Add event listeners
      contract.on(transferFilter, handleMintEvent);
      contract.on(batchTransferFilter, handleBatchMintEvent);

      // Store listeners for cleanup
      listenersRef.current = [
        { filter: transferFilter, handler: handleMintEvent },
        { filter: batchTransferFilter, handler: handleBatchMintEvent }
      ];

      setIsListening(true);
      console.log('🎧 Started listening for mint events');

    } catch (error) {
      console.error('❌ Failed to start event listening:', error);
    }
  }, [isListening]);

  // Stop listening for events
  const stopEventListening = useCallback(() => {
    if (!contractRef.current || !isListening) return;

    try {
      const contract = contractRef.current;
      
      // Remove all listeners
      listenersRef.current.forEach(({ filter, handler }) => {
        contract.off(filter, handler);
      });

      listenersRef.current = [];
      setIsListening(false);
      console.log('🔇 Stopped listening for mint events');

    } catch (error) {
      console.error('❌ Failed to stop event listening:', error);
    }
  }, [isListening]);

  // Handle pending refresh
  useEffect(() => {
    if (pendingRefresh) {
      console.log('🔄 Auto-refreshing data due to detected mint...');
      baseHook.refresh().then(() => {
        setPendingRefresh(false);
        setLastSyncTime(new Date());
        console.log('✅ Data refreshed after mint detection');
      });
    }
  }, [pendingRefresh, baseHook]);

  // Auto-sync: Periodically check for updates
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [autoSyncInterval, setAutoSyncInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    if (!autoSyncEnabled) return;

    const interval = setInterval(async () => {
      console.log('🔄 Auto-sync check...');
      
      // Quick check: compare latest block data
      try {
        if (!contractRef.current) return;

        const contract = contractRef.current;
        
        // Get current minted count for first token as a quick check
        const currentConfig = await contract.tokenConfigs(0);
        const cachedToken = baseHook.getToken(0);
        
        if (cachedToken && parseInt(currentConfig.minted.toString()) !== parseInt(cachedToken.minted)) {
          console.log('📊 Detected data changes, refreshing...');
          setPendingRefresh(true);
        }
      } catch (error) {
        console.error('❌ Auto-sync check failed:', error);
      }
    }, autoSyncInterval);

    return () => clearInterval(interval);
  }, [autoSyncEnabled, autoSyncInterval, baseHook]);

  // Initialize on mount
  useEffect(() => {
    initializeEventListening().then((success) => {
      if (success) {
        startEventListening();
      }
    });

    return () => {
      stopEventListening();
    };
  }, [initializeEventListening, startEventListening, stopEventListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEventListening();
      if (providerRef.current) {
        providerRef.current.removeAllListeners();
      }
    };
  }, [stopEventListening]);

  // Enhanced refresh that also updates sync time
  const refreshWithSync = useCallback(async () => {
    const result = await baseHook.refresh();
    setLastSyncTime(new Date());
    return result;
  }, [baseHook]);

  // Manual sync check
  const checkForUpdates = useCallback(async () => {
    console.log('🔍 Manual sync check...');
    setPendingRefresh(true);
  }, []);

  return {
    // All base hook functionality
    ...baseHook,
    
    // Enhanced refresh
    refresh: refreshWithSync,
    
    // Sync-specific state
    isListening,
    lastSyncTime,
    pendingRefresh,
    
    // Sync controls
    startEventListening,
    stopEventListening,
    checkForUpdates,
    
    // Auto-sync controls
    autoSyncEnabled,
    setAutoSyncEnabled,
    autoSyncInterval,
    setAutoSyncInterval,
    
    // Sync utilities
    getSyncStatus: () => ({
      isListening,
      lastSyncTime,
      autoSyncEnabled,
      autoSyncInterval,
      pendingRefresh
    })
  };
} 