"use client";

// import { Web3OnboardProvider, init } from '@web3-onboard/react';
// import injectedModule from '@web3-onboard/injected-wallets';
// import { SUPPORTED_NETWORKS } from '@/utils/networkConfig';
import DynamicProvider from '@/components/common/DynamicProvider';

// const injected = injectedModule();

// Convert our network config to web3-onboard format
// const chains = Object.values(SUPPORTED_NETWORKS).map(network => ({
//   id: network.id,
//   token: network.token,
//   label: network.name,
//   rpcUrl: network.rpcUrl
// }));

// const web3Onboard = init({
//   wallets: [injected],
//   chains: chains,
//   appMetadata: {
//     name: 'RewardCrate Minter',
//     icon: '/favicon.ico',
//     description: 'Mint ERC1155 RewardCrate tokens'
//   }
// });

export function Providers({ children }) {
  return (
    <DynamicProvider>
      {/* <Web3OnboardProvider web3Onboard={web3Onboard}> */}
        {children}
      {/* </Web3OnboardProvider> */}
    </DynamicProvider>
  );
} 