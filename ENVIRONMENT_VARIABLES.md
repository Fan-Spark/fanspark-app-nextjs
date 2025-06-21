# Environment Variables

This project uses environment variables to configure various features. Create a `.env.local` file in the root directory and add the following variables:

## Required Variables

### Dynamic.xyz Configuration
```bash
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here
```

### Blockchain Configuration
```bash
NEXT_PUBLIC_RPC_URL=your_rpc_url_here
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_NETWORK_CHAIN_ID=8453
```

## Optional Variables

### Card Payment Feature (Crossmint Integration)
```bash
# Enable or disable the "Pay with Card" feature
# Set to 'true' to enable, 'false' or omit to disable
NEXT_PUBLIC_ENABLE_CARD_PAYMENTS=true

# Crossmint configuration (required if card payments are enabled)
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=your_crossmint_project_id_here
NEXT_PUBLIC_CROSSMINT_BASE_URL=https://staging.crossmint.com
```

### Other Configuration
```bash
# Base network configuration
NEXT_PUBLIC_NETWORK_NAME=Base
NEXT_PUBLIC_NETWORK_CURRENCY=ETH
```

## Environment Variable Details

### `NEXT_PUBLIC_ENABLE_CARD_PAYMENTS`
- **Type**: Boolean string ('true' or 'false')
- **Default**: false (if not set)
- **Description**: Controls whether the "Pay with Card" buttons are shown in the UI
- **Impact**: 
  - When `true`: Shows card payment buttons in both TokenCard and Cart components
  - When `false` or not set: Hides all card payment functionality

### `NEXT_PUBLIC_CROSSMINT_PROJECT_ID`
- **Type**: String
- **Required**: Only if `NEXT_PUBLIC_ENABLE_CARD_PAYMENTS=true`
- **Description**: Your Crossmint project ID for card payment processing

### `NEXT_PUBLIC_CROSSMINT_BASE_URL`
- **Type**: String
- **Default**: `https://staging.crossmint.com`
- **Description**: Base URL for Crossmint checkout

## Example .env.local File

```bash
# Dynamic.xyz
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=dc644cce-6fae-4142-873a-93d867c8a2c6

# Blockchain
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NETWORK_CHAIN_ID=8453

# Card Payments (Optional)
NEXT_PUBLIC_ENABLE_CARD_PAYMENTS=true
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CROSSMINT_BASE_URL=https://staging.crossmint.com

# Network
NEXT_PUBLIC_NETWORK_NAME=Base
NEXT_PUBLIC_NETWORK_CURRENCY=ETH
```

## Notes

- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Environment variables are read at build time for static generation
- Restart your development server after changing environment variables
- Never commit your `.env.local` file to version control 