// Network configuration using environment variables
const getCurrentNetworkConfig = () => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'); // Default to Base Sepolia
  
  return {
    id: chainId,
    name: process.env.NEXT_PUBLIC_NETWORK_NAME || 'Base Sepolia',
    displayName: process.env.NEXT_PUBLIC_NETWORK_DISPLAY_NAME || 'Base Sepolia Testnet',
    chainId: chainId,
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
    blockExplorerUrl: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || 'https://sepolia.basescan.org',
    blockExplorerName: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_NAME || 'BaseScan',
    isDefault: true
  };
};

// Get the current network configuration
export const CURRENT_NETWORK = getCurrentNetworkConfig();

// Legacy support for existing code
export const SUPPORTED_NETWORKS = {
  [CURRENT_NETWORK.id]: {
    id: CURRENT_NETWORK.id,
    name: CURRENT_NETWORK.name,
    label: CURRENT_NETWORK.displayName,
    chainId: CURRENT_NETWORK.chainId,
    rpcUrl: CURRENT_NETWORK.rpcUrl,
    blockExplorerUrl: CURRENT_NETWORK.blockExplorerUrl,
    blockExplorerName: CURRENT_NETWORK.blockExplorerName,
    isSupported: true
  }
};

// Default network is the current configured network
export const DEFAULT_NETWORK = CURRENT_NETWORK;

// Helper function to get network by ID
export const getNetworkById = (chainId) => {
  return SUPPORTED_NETWORKS[chainId] || null;
};

// Helper function to check if a network is supported
export const isNetworkSupported = (chainId) => {
  return !!SUPPORTED_NETWORKS[chainId];
};

// Helper function to get the block explorer URL for a transaction
export const getTransactionUrl = (txHash) => {
  return `${CURRENT_NETWORK.blockExplorerUrl}/tx/${txHash}`;
};

// Helper function to get the block explorer URL for an address
export const getAddressUrl = (address) => {
  return `${CURRENT_NETWORK.blockExplorerUrl}/address/${address}`;
};

// Helper function to get the block explorer URL for a contract
export const getContractUrl = (contractAddress) => {
  return `${CURRENT_NETWORK.blockExplorerUrl}/address/${contractAddress}`;
};

// Brand configuration
export const BRAND_CONFIG = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'FanSpark',
  projectName: process.env.NEXT_PUBLIC_PROJECT_NAME || 'Reward Crate Minter',
  url: process.env.NEXT_PUBLIC_BRAND_URL || 'https://www.fanspark.xyz',
  metadataBaseUrl: process.env.NEXT_PUBLIC_METADATA_BASE_URL || 'https://checkout.fanspark.xyz',
  defaultCollection: process.env.NEXT_PUBLIC_DEFAULT_COLLECTION || 'reward-crate'
};

// Export for backwards compatibility
export default {
  getCurrentNetworkConfig,
  CURRENT_NETWORK,
  SUPPORTED_NETWORKS,
  DEFAULT_NETWORK,
  getNetworkById,
  isNetworkSupported,
  getTransactionUrl,
  getAddressUrl,
  getContractUrl,
  BRAND_CONFIG
}; 