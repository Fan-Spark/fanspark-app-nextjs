# Reward Crate NFT Metadata

This folder contains the metadata for the FanSpark Reward Crate NFT collection.

## Collection Overview:

### Token #0 - Standard
- **Edition**: Open Edition (Unlimited supply)
- **Rarity**: Common
- **Rewards**: Digital comic, 200 $ARDENT tokens, 1 PFP collectible

### Token #1 - Ardent Fan  
- **Edition**: Limited Edition (200 supply)
- **Rarity**: Rare
- **Rewards**: Digital + physical comic, 500 $ARDENT tokens, 3 PFP collectibles, T-shirt, limited pin

### Token #2 - Super Stellar
- **Edition**: Ultra Limited Edition (20 supply)
- **Rarity**: Legendary  
- **Rewards**: Digital + physical comic, 2,000 $ARDENT tokens, 10 PFP collectibles, T-shirt, hoodie, limited pin

## File Structure:
```
/metadata/reward-crate/
├── 0.json          # Standard tier metadata
├── 1.json          # Ardent Fan tier metadata
├── 2.json          # Super Stellar tier metadata
├── images/         # NFT images folder
│   ├── 0.png       # Standard tier image
│   ├── 1.png       # Ardent Fan tier image
│   └── 2.png       # Super Stellar tier image
└── README.md       # This file
```

## Deployment Notes:
1. Update image URLs in JSON files to point to your actual domain/IPFS
2. Ensure images are uploaded to the correct location
3. Test metadata URLs before contract deployment

## Metadata Standard:
Files follow the ERC-1155 metadata standard with OpenSea compatibility. 