# Contract Data Caching System

This project now uses a caching system to avoid excessive RPC calls to the blockchain. Instead of fetching contract data in real-time (which is slow and expensive), we pre-fetch all the data once and serve it from a JSON file.

## How it Works

1. **Data Fetching Script** (`scripts/fetch-contract-data.js`): Fetches all contract data from the blockchain and saves it to `public/contract-data.json`
2. **React Hook** (`src/hooks/useContractData.js`): Loads the cached data from the JSON file instead of making blockchain calls
3. **UI Components**: Use the cached data for instant loading

## Quick Start

### 1. Set up Environment Variables

Make sure you have these in your `.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_RPC_URL=your_rpc_url_here
```

### 2. Install Dependencies

```bash
npm install dotenv
```

### 3. Fetch Contract Data

Run this command to fetch fresh contract data:

```bash
npm run fetch-contract-data
```

Or directly:

```bash
node scripts/fetch-contract-data.js
```

### 4. Start Development Server

```bash
npm run dev
```

Your app will now load contract data instantly from the cached JSON file!

## Usage

### Running the Fetch Script

```bash
# Fetch latest contract data
npm run fetch-contract-data

# Alternative command
npm run fetch-data
```

The script will:
- ✅ Fetch data for all 10 tokens (0-9)
- ✅ Save to `public/contract-data.json`
- ✅ Create a minified version for production
- ✅ Create a timestamped backup
- ✅ Handle errors gracefully with retry logic
- ✅ Show progress and summary

### When to Run the Script

Run the fetch script when:
- **Initial Setup**: Before first run
- **After Mints**: When new tokens are minted (updates minted counts)
- **Contract Updates**: When contract configuration changes
- **Scheduled Updates**: Set up a cron job for regular updates

### Automation Options

#### Option 1: Cron Job (Recommended)
```bash
# Add to crontab to run every 5 minutes
*/5 * * * * cd /path/to/your/project && npm run fetch-contract-data
```

#### Option 2: GitHub Actions
```yaml
name: Update Contract Data
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run fetch-contract-data
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/contract-data.json
          git diff --staged --quiet || git commit -m "Update contract data"
          git push
```

#### Option 3: Next.js API Route (Advanced)
Create an API route that fetches and updates the data:

```javascript
// pages/api/update-contract-data.js
import { fetchContractData, saveContractData } from '../../scripts/fetch-contract-data.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = await fetchContractData();
      await saveContractData(data);
      res.status(200).json({ success: true, updated: data.metadata.fetchedAt });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## Generated Files

### `public/contract-data.json`
Main data file with formatted JSON:
```json
{
  "metadata": {
    "contractAddress": "0x...",
    "fetchedAt": "2024-01-15T10:30:00.000Z",
    "fetchedTimestamp": 1705312200000,
    "rpcUrl": "https://...",
    "version": "1.0.0"
  },
  "tokens": [
    {
      "id": 0,
      "price": "0.001",
      "whitelistPrice": "0.0005",
      "maxSupply": 1000,
      "minted": 50,
      "mintingActive": true,
      "isWhitelistActive": false,
      "lastUpdated": 1705312200000
    }
  ],
  "summary": {
    "totalTokens": 10,
    "totalMinted": 500,
    "totalAvailable": 9500,
    "activeTokens": 8,
    "whitelistActiveTokens": 2
  }
}
```

### `public/contract-data.min.json`
Minified version for production use.

### `public/contract-data-backup-*.json`
Timestamped backups for recovery.

## UI Features

### Data Age Indicators
The UI shows warnings when data is stale:
- 🟡 **Yellow Alert**: Data is older than 30 minutes
- 🔴 **Red Alert**: Failed to load cached data

### Manual Refresh
Users can manually refresh data with the "Refresh now" button in stale data warnings.

### Error Handling
If cached data fails to load, the UI shows helpful error messages with suggestions to run the fetch script.

## Development vs Production

### Development
- Run fetch script manually when needed
- Data refreshes are explicit and visible
- Easy to test with fresh data

### Production
- Set up automated fetching (cron job/GitHub Actions)
- Consider CDN caching for the JSON file
- Monitor data freshness

## Real-Time Synchronization

The system now includes **real-time sync capabilities** to automatically detect when tokens are minted from any source:

### 🎧 Event Listening
- **Listens for mint events** on the blockchain in real-time
- **Auto-refreshes data** when mints are detected (2-second delay for blockchain finality)
- **Works for all mints** - whether from your app or other interfaces

### 🔄 Auto-Sync Polling  
- **Periodically checks** for data changes (configurable: 15s, 30s, 60s, 2min)
- **Smart comparison** - only refreshes when actual changes detected
- **Backup system** - ensures data stays current even if events are missed

### 🎛️ Sync Controls
Users can control sync behavior via the **Sync Indicator** in the UI:
- 🟢 **Live**: Real-time events + auto-sync enabled
- 🟡 **Listening**: Real-time events only
- ⚫ **Offline**: Manual refresh only
- 🔵 **Syncing**: Currently updating data

## Benefits

### Performance
- ⚡ **Instant Loading**: No blockchain calls = instant UI
- 🔄 **No Rate Limits**: Eliminates RPC rate limiting issues
- 💰 **Cost Savings**: Dramatically reduces RPC usage costs
- 🎯 **Smart Updates**: Only refreshes when changes detected

### Reliability
- 🛡️ **Error Resilience**: Cached data works even if RPC is down
- 🔄 **Retry Logic**: Script handles temporary failures
- 📊 **Data Validation**: Ensures data integrity
- 🎧 **Real-time Awareness**: Never miss external mints

### User Experience
- 🚀 **Fast UI**: Users see data immediately
- 📊 **Progress Feedback**: Clear loading states and error messages
- 🔄 **Smart Refresh**: Only updates when needed
- 🎛️ **User Control**: Configurable sync settings

## Troubleshooting

### Script Fails to Run
```bash
# Check environment variables
echo $NEXT_PUBLIC_CONTRACT_ADDRESS
echo $NEXT_PUBLIC_RPC_URL

# Check network connectivity
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' $NEXT_PUBLIC_RPC_URL
```

### UI Shows "Failed to load contract data"
1. Ensure `public/contract-data.json` exists
2. Run the fetch script: `npm run fetch-contract-data`
3. Check file permissions on the `public/` directory

### Data Seems Outdated
1. Check the timestamp in contract-data.json
2. Run a fresh fetch: `npm run fetch-contract-data`
3. Set up automated fetching for regular updates

### RPC Rate Limiting During Fetch
The script includes automatic retry logic and delays, but if you hit limits:
1. Increase delays in the script (edit `delay(200)` to `delay(500)`)
2. Use a different RPC endpoint
3. Consider using a premium RPC service

## Advanced Configuration

### Customize Token Range
Edit `scripts/fetch-contract-data.js`:
```javascript
// Change this line to fetch different token range
for (let tokenId = 0; tokenId < 20; tokenId++) { // Now fetches 0-19
```

### Adjust Cache Duration
Edit `src/hooks/useContractData.js`:
```javascript
// Change staleness threshold (30 minutes = 30 * 60 * 1000)
const thirtyMinutes = 60 * 60 * 1000; // Now 60 minutes
```

### Custom Output Location
Edit `scripts/fetch-contract-data.js`:
```javascript
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'contract.json');
```

## Next Steps

1. **Run the fetch script** to generate your first cache file
2. **Set up automation** to keep data fresh
3. **Monitor performance** and adjust refresh frequency as needed
4. **Consider CDN** for production deployments

Your app now loads blazingly fast with zero blockchain calls for displaying data! 🚀 