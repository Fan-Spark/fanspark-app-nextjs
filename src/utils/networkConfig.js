export const SUPPORTED_NETWORKS = {
  base: {
    id: '0x2105',
    name: 'Base',
    chainId: 8453,
    token: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    isDefault: true // Mark Base as the default network
  },
  // baseGoerli: {
  //   id: '0x14a33',
  //   name: 'Base Goerli',
  //   chainId: 84531,
  //   token: 'ETH',
  //   rpcUrl: 'https://goerli.base.org',
  //   blockExplorer: 'https://goerli.basescan.org',
  //   isDefault: false
  // },
  // baseSepolia: {
  //   id: '0x14a34',
  //   name: 'Base Sepolia',
  //   chainId: 84532,
  //   token: 'ETH',
  //   rpcUrl: 'https://sepolia.base.org',
  //   blockExplorer: 'https://sepolia.basescan.org',
  //   isDefault: false
  // },
  // mainnet: {
  //   id: '0x1',
  //   name: 'Ethereum Mainnet',
  //   chainId: 1,
  //   token: 'ETH',
  //   rpcUrl: 'https://eth.llamarpc.com',
  //   blockExplorer: 'https://etherscan.io',
  //   isDefault: false
  // },
  // goerli: {
  //   id: '0x5',
  //   name: 'Goerli Testnet',
  //   chainId: 5,
  //   token: 'ETH',
  //   rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  //   blockExplorer: 'https://goerli.etherscan.io',
  //   isDefault: false
  // },
  // sepolia: {
  //   id: '0xaa36a7',
  //   name: 'Sepolia Testnet',
  //   chainId: 11155111,
  //   token: 'ETH',
  //   rpcUrl: 'https://rpc.sepolia.org',
  //   blockExplorer: 'https://sepolia.etherscan.io',
  //   isDefault: false
  // }
};

export const DEFAULT_NETWORK = Object.values(SUPPORTED_NETWORKS).find(network => network.isDefault);

export const getNetworkById = (id) => {
  return Object.values(SUPPORTED_NETWORKS).find(network => 
    network.id.toLowerCase() === id.toLowerCase() || 
    network.chainId === parseInt(id)
  );
}; 