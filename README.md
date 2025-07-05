# Reward Crate Minter

A Next.js application for minting RewardCrate ERC1155 tokens on configurable blockchain networks.

## Features

- 🔗 **Multi-Network Support**: Configurable blockchain networks (Base, Flow, Ethereum, etc.)
- 💰 **Dynamic Pricing**: Support for public and whitelist pricing
- 🛒 **Cart System**: Add multiple tokens to cart for batch minting
- ⚡ **Batch Minting**: Mint multiple tokens in sequence
- 🎨 **NFT Metadata**: Display actual NFT images and metadata
- 📱 **Mobile Responsive**: Works on all devices
- 🔐 **Wallet Integration**: Multiple wallet support via Dynamic.xyz
- 🌐 **Real-time Updates**: Live contract data synchronization

## Network Configuration

This application supports multiple blockchain networks through environment variables. By default, it's configured for Base Sepolia testnet, but can be easily switched to other networks.

### Supported Networks

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia** (Chain ID: 84532) - Default
- **Ethereum Mainnet** (Chain ID: 1)
- **Flow EVM** (Chain ID: 747) - Future support
- **Custom Networks** - Configure any EVM-compatible network

### Environment Configuration

Copy `.env.local.example` to `.env.local` and configure your network:

```bash
cp .env.local.example .env.local
```

Key environment variables:
- `NEXT_PUBLIC_NETWORK_NAME`: Network identifier
- `NEXT_PUBLIC_NETWORK_DISPLAY_NAME`: User-friendly network name
- `NEXT_PUBLIC_CHAIN_ID`: Network chain ID
- `NEXT_PUBLIC_RPC_URL`: Network RPC endpoint
- `NEXT_PUBLIC_BLOCK_EXPLORER_URL`: Block explorer URL
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Smart contract address

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Fetch contract data**
   ```bash
   npm run fetch-contract-data
   # or for specific collection:
   node scripts/fetch-contract-data.js reward-crate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run fetch-contract-data` - Fetch latest contract data from blockchain
- `npm run test-whitelist` - Test whitelist functionality
- `npm run test-agents` - Test AI agents API

## Architecture

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS with shadcn/ui components
- **Wallet**: Dynamic.xyz for multi-wallet support
- **Blockchain**: Ethers.js for smart contract interaction
- **State**: React hooks with local storage persistence

## Development

### Adding New Networks

1. Update `.env.local` with new network configuration
2. The application will automatically adapt to the new network
3. Test with the new network's testnet first

### Adding New Collections

1. Create metadata files in `public/metadata/[collection-name]/`
2. Run the fetch script with the collection name:
   ```bash
   node scripts/fetch-contract-data.js [collection-name]
   ```

## Deployment

The application is designed to be deployed on Vercel, Netlify, or any platform supporting Next.js.

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Deploy** using your preferred method

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[MIT License](LICENSE)

# RewardCrate Minting dApp

This dApp allows users to mint RewardCrate ERC1155 tokens on the Base network.

## Features

- Connect to Web3 wallet (MetaMask, WalletConnect, etc.)
- View available tokens and their details
- Mint individual tokens
- Batch mint multiple tokens in one transaction
- Whitelist support with Merkle proofs

## Whitelist Implementation

The whitelist uses Merkle trees for secure, gas-efficient verification:

1. A Merkle tree is generated from the whitelist data
2. The Merkle root is stored in the smart contract
3. When a whitelisted user mints, they provide a Merkle proof
4. The contract verifies the proof against the stored root

### Contract Integration

The smart contract has a `mintWhitelist` function that accepts:
- `tokenId`: The ID of the token to mint
- `amount`: The amount to mint
- `merkleProof`: An array of bytes32 values that prove the user is on the whitelist

The contract will verify the proof by:
1. Creating a leaf from `msg.sender`, `tokenId`, and `amount`
2. Verifying the proof against the stored Merkle root

### Generating the Merkle Root and Proofs

To generate the Merkle root and proofs, use the provided script in the `scripts` folder:

```
node scripts/generate-merkle-tree.js
```

This will:
1. Read the whitelist from `whitelist.json`
2. Generate the Merkle root to be set in the contract
3. Generate proofs for all whitelist entries and save them

## Integration with WordPress

This app is designed to be embedded in WordPress sites via iframes. See the integration guide in the docs folder.
