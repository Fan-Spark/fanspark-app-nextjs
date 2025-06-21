import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

// You'll need to get these from your Dynamic.xyz dashboard
const DYNAMIC_ENVIRONMENT_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

// Debug logging
console.log("Dynamic Environment ID:", DYNAMIC_ENVIRONMENT_ID);

if (!DYNAMIC_ENVIRONMENT_ID) {
  console.warn("NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID is not set. Using demo environment.");
}

export const dynamicConfig = {
  environmentId: DYNAMIC_ENVIRONMENT_ID || "demo",
  walletConnectors: [EthereumWalletConnectors],
  settings: {
    walletList: ["metamask", "walletconnect", "coinbase", "rainbow"],
    eventsCallbacks: {
      onAuthSuccess: (args) => {
        console.log("Dynamic Auth Success:", args);
      },
      onAuthError: (args) => {
        console.error("Dynamic Auth Error:", args);
      },
      onConnect: (args) => {
        console.log("Dynamic Connect:", args);
      },
      onDisconnect: (args) => {
        console.log("Dynamic Disconnect:", args);
      },
    },
  },
  // Optional: Customize the UI
  appearance: {
    theme: "dark",
    accentColor: "#3b82f6", // Blue color matching your theme
    borderRadius: "medium",
    overlay: {
      blur: "none",
    },
  },
};

export { DynamicContextProvider }; 