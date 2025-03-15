This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
