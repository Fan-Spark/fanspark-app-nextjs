import { ethers } from 'ethers';

// Default RPC providers. These are public and may be rate-limited.
// For production, it's recommended to use your own RPC endpoints.
const ETH_MAINNET_RPC = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const BASE_MAINNET_RPC = 'https://mainnet.base.org';

export const evmNetworks = [
  {
    networkId: 1,
    chainId: 1,
    name: 'Ethereum',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ETH_MAINNET_RPC],
    blockExplorerUrls: ['https://etherscan.io'],
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    provider: new ethers.providers.JsonRpcProvider(ETH_MAINNET_RPC),
  },
  {
    networkId: 8453,
    chainId: 8453,
    name: 'Base',
    chainName: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [BASE_MAINNET_RPC],
    blockExplorerUrls: ['https://basescan.org'],
    iconUrls: ['https://app.dynamic.xyz/assets/networks/base.svg'],
    provider: new ethers.providers.JsonRpcProvider(BASE_MAINNET_RPC),
  },
]; 