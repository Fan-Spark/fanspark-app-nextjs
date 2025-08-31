# Environment Configuration Example

Copy this to your `.env.local` file and update the values:

```bash
# Dynamic.xyz Configuration
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# Blockchain Configuration
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_NETWORK_CHAIN_ID=8453

# Donation Configuration
NEXT_PUBLIC_DONATION_WALLET_ADDRESS=0x1234567890123456789012345678901234567890

# Card Payment Feature (Crossmint Integration)
NEXT_PUBLIC_ENABLE_CARD_PAYMENTS=true
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=your_crossmint_project_id_here
NEXT_PUBLIC_CROSSMINT_BASE_URL=https://staging.crossmint.com

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret_here

# Agents API Configuration
AGENTS_APP_ID=your_agents_app_id_here
AGENTS_APP_SECRET=your_agents_app_secret_here

# Network Configuration
NEXT_PUBLIC_NETWORK_NAME=Base
NEXT_PUBLIC_NETWORK_CURRENCY=ETH
```

## Important Notes:

1. **Donation Wallet Address**: Set `NEXT_PUBLIC_DONATION_WALLET_ADDRESS` to your actual wallet address that will receive donations
2. **USDC Support**: The donation system works with USDC tokens on the Base network
3. **Security**: Never share your private keys or seed phrases
4. **Testing**: Test with small amounts first on testnet if available
