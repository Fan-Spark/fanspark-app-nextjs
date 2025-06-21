"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { dynamicConfig } from "@/lib/dynamic-config";
import { evmNetworks } from "@/lib/networks";
const DynamicProvider = ({ children }) => {
  // We can't render the provider on the server, so we return null.
  // The provider will be rendered on the client.
  // See: https://docs.dynamic.xyz/get-started/next-js/app-router#step-3-add-the-dynamiccontexprovider
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicConfig.environmentId,
        walletConnectors: [EthereumWalletConnectors],
        walletConnectorExtensions: [],
        authMode: 'email-and-wallet',
        theme: 'dark',
        evmNetworks,
        // Enable network switching
        enableNetworkSwitching: true,
        // Auto-switch to preferred network
        initialAuthenticationMode: 'connect-and-sign',
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicProvider; 