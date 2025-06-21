"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// Get environment ID on client side
const DYNAMIC_ENVIRONMENT_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

console.log("Dynamic Environment ID (Client):", DYNAMIC_ENVIRONMENT_ID);

export default function DynamicProvider({ children }) {
  // Ensure environmentId is set
  if (!DYNAMIC_ENVIRONMENT_ID) {
    console.error("Dynamic.xyz environment ID is not properly configured!");
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
        <h3 className="font-bold text-red-800">Configuration Error</h3>
        <p className="text-sm text-red-700">
          NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID is not set. Please check your .env.local file.
        </p>
        <p className="text-xs text-red-600 mt-1">
          Current value: {DYNAMIC_ENVIRONMENT_ID || "undefined"}
        </p>
      </div>
    );
  }

  return (
    <DynamicContextProvider
      walletConnectors={[EthereumWalletConnectors]}
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],

        // Explicitly set the authentication mode to allow both wallets and email
        authMode: 'email-and-wallet',

        walletList: ["metamask", "walletconnect", "coinbase", "rainbow"],
      }}
      appearance={{
        theme: "dark",
        accentColor: "#3b82f6",
        borderRadius: "medium",
      }}
    >
      {children}
    </DynamicContextProvider>
  );
} 