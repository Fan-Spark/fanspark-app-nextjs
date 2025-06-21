# Dynamic.xyz Integration Setup

This project now includes Dynamic.xyz for enhanced wallet authentication and user management. Here's how to set it up:

## 1. Get Your Dynamic.xyz Environment ID

1. Go to [Dynamic.xyz Dashboard](https://app.dynamic.xyz/)
2. Create a new project or use an existing one
3. Copy your Environment ID from the project settings

## 2. Environment Configuration

Add the following to your `.env.local` file:

```bash
# Dynamic.xyz Configuration
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_environment_id_here

# Existing Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=your_crossmint_project_id_here
NEXT_PUBLIC_CROSSMINT_BASE_URL=https://staging.crossmint.com

# Card Payment Feature Toggle
# Set to 'true' to enable "Pay with Card" buttons, 'false' or omit to disable
NEXT_PUBLIC_ENABLE_CARD_PAYMENTS=true
```

## 3. Dynamic.xyz Features

### Wallet Authentication
- **Multiple Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and more
- **Seamless Connection**: One-click wallet connection with persistent sessions
- **Network Switching**: Automatic network detection and switching

### User Portal
- **Profile Management**: Users can manage their profiles through Dynamic.xyz
- **Wallet Information**: Display wallet details and transaction history
- **Security Features**: Built-in security and authentication features

### Integration Points

#### Components
- `DynamicWalletButton`: Desktop wallet connection button with dropdown
- `DynamicMobileWallet`: Mobile-friendly wallet component
- `DynamicPortal`: Full user portal page at `/portal`

#### Hooks
- `useDynamicWallet`: Custom hook for wallet functionality
- Provides connection state, user info, and wallet actions

#### Configuration
- `dynamic-config.js`: Main configuration file
- Customizable appearance and wallet list

## 4. Usage Examples

### Basic Wallet Connection
```jsx
import { useDynamicWallet } from '@/hooks/useDynamicWallet';

function MyComponent() {
  const { isConnected, connect, disconnect, walletAddress } = useDynamicWallet();
  
  return (
    <div>
      {isConnected ? (
        <button onClick={disconnect}>Disconnect</button>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Access User Profile
```jsx
import { useDynamicWallet } from '@/hooks/useDynamicWallet';

function ProfileButton() {
  const { openProfile } = useDynamicWallet();
  
  return (
    <button onClick={openProfile}>
      Open Profile
    </button>
  );
}
```

## 5. Customization

### Wallet List
Edit `src/lib/dynamic-config.js` to customize supported wallets:

```javascript
settings: {
  walletList: ["metamask", "walletconnect", "coinbase", "rainbow"],
  // ... other settings
}
```

### Appearance
Customize the UI appearance in the same file:

```javascript
appearance: {
  theme: "dark",
  accentColor: "#3b82f6",
  borderRadius: "medium",
}
```

## 6. Migration from Web3Onboard

The integration maintains compatibility with your existing Web3Onboard setup. You can:

1. **Gradual Migration**: Use both systems side by side
2. **Full Migration**: Replace Web3Onboard entirely with Dynamic.xyz
3. **Hybrid Approach**: Use Dynamic.xyz for auth and Web3Onboard for specific features

## 7. Benefits of Dynamic.xyz

- **Better UX**: Smoother wallet connection experience
- **User Profiles**: Built-in user management and profiles
- **Security**: Enhanced security features and session management
- **Analytics**: Built-in analytics and user insights
- **Multi-chain**: Better multi-chain support and network switching

## 8. Troubleshooting

### Common Issues

1. **Environment ID not found**: Make sure your environment ID is correctly set in `.env.local`
2. **Wallet not connecting**: Check that the wallet is supported in your configuration
3. **Network issues**: Ensure your network is supported in the Dynamic.xyz configuration

### Support

- [Dynamic.xyz Documentation](https://docs.dynamic.xyz/)
- [Dynamic.xyz Discord](https://discord.gg/dynamic)
- [GitHub Issues](https://github.com/dynamic-labs/dynamic-sdk-js/issues) 