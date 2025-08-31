# USDC Price Update Summary

## Overview
Updated the FanSpark UI minter app to handle USDC pricing instead of ETH pricing. The contract now returns prices in USDC format where `5000` represents `0.005 USDC` (5000 / 1,000,000).

## Changes Made

### 1. Fetch Contract Data Script (`scripts/fetch-contract-data.js`)
- Added `formatUSDCPrice()` function to convert raw contract prices to USDC format
- Updated price handling to store both USDC and legacy ETH formats
- Added `priceFormat: "USDC"` to metadata
- Added new fields: `priceRaw`, `whitelistPriceRaw` for raw contract values
- Added legacy fields: `priceETH`, `whitelistPriceETH` for backward compatibility
- Updated console logging to show USDC prices

### 2. UI Components Updated

#### TokenCard Component (`src/components/common/TokenCard.jsx`)
- Updated price badge to show "USDC" instead of "ETH"
- Updated total price display to show "USDC" instead of "ETH"

#### Cart Component (`src/components/common/Cart.jsx`)
- Updated individual item price display to show "USDC" instead of "ETH"
- Updated total price display to show "USDC" instead of "ETH"

#### BatchMintModal Component (`src/components/common/BatchMintModal.jsx`)
- Updated total price display to show "USDC" instead of "ETH"

#### HomeComponent (`src/components/home/HomeComponent.jsx`)
- Updated price display in cart items to show "USDC" instead of "ETH"
- Updated total price display to show "USDC" instead of "ETH"
- Updated error message to mention "USDC" instead of "ETH"
- Updated console logging to show "USDC" instead of "ETH"
- **Note**: Kept `ethers.utils.parseEther()` for transaction encoding as it still works with decimal USDC prices

## Price Format Changes

### Before (ETH)
```json
{
  "price": "0.000000000000005",
  "priceWei": "5000"
}
```

### After (USDC)
```json
{
  "price": "0.005000",
  "priceWei": "5000",
  "priceRaw": 5000,
  "priceETH": "0.000000000000005",
  "priceFormat": "USDC"
}
```

## Key Benefits

1. **Clearer Pricing**: Users now see prices in familiar USDC format (e.g., "0.005 USDC")
2. **Backward Compatibility**: Legacy ETH price fields are preserved
3. **Raw Data Access**: `priceRaw` field provides access to the original contract value
4. **Consistent UI**: All price displays now consistently show "USDC"

## Testing

The updated fetch script has been tested and successfully:
- Converts raw price `5000` to `0.005000 USDC`
- Maintains backward compatibility with ETH format
- Updates all UI components to display USDC
- Preserves existing functionality

## Usage

### Running the Updated Script
```bash
node scripts/fetch-contract-data.js reward-crate
```

### Expected Output
```
✅ Token #0 (Standard): 0.005000 USDC, Minted: 0/∞
✅ Token #1 (Ardent Fan): 0.005000 USDC, Minted: 0/200
✅ Token #2 (Super Stellar): 0.005000 USDC, Minted: 0/20
```

## Files Modified

1. `scripts/fetch-contract-data.js` - Core price conversion logic
2. `src/components/common/TokenCard.jsx` - Price display updates
3. `src/components/common/Cart.jsx` - Cart price display updates
4. `src/components/common/BatchMintModal.jsx` - Modal price display updates
5. `src/components/home/HomeComponent.jsx` - Main component price display updates

## Next Steps

1. **Deploy**: The changes are ready for deployment
2. **Monitor**: Watch for any issues with price display or calculations
3. **User Testing**: Verify that users understand the new USDC pricing format
4. **Documentation**: Update any user-facing documentation to reflect USDC pricing
