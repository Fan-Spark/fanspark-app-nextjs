#!/usr/bin/env node

const { ethers } = require('ethers');
const { formatEther } = require('ethers/lib/utils');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'contract-data.json');

// Load contract ABI
const contractABI = require('../src/utils/contractABI.json');

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const waitTime = baseDelay * Math.pow(2, i);
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${waitTime}ms due to:`, error.message);
      await delay(waitTime);
    }
  }
};

async function fetchContractData() {
  console.log('🚀 Starting contract data fetch...');
  console.log(`📊 Contract: ${CONTRACT_ADDRESS}`);
  console.log(`🌐 RPC URL: ${RPC_URL}`);
  
  if (!CONTRACT_ADDRESS || !RPC_URL) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_CONTRACT_ADDRESS and NEXT_PUBLIC_RPC_URL');
  }

  // Create provider and contract instance
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

  const contractData = {
    metadata: {
      contractAddress: CONTRACT_ADDRESS,
      fetchedAt: new Date().toISOString(),
      fetchedTimestamp: Date.now(),
      rpcUrl: RPC_URL,
      version: "1.0.0"
    },
    tokens: [],
    summary: {
      totalTokens: 0,
      totalMinted: 0,
      totalAvailable: 0,
      activeTokens: 0,
      whitelistActiveTokens: 0
    }
  };

  let totalMinted = 0;
  let totalAvailable = 0;
  let activeTokens = 0;
  let whitelistActiveTokens = 0;

  console.log('\n📦 Fetching token data...');

  // Fetch data for tokens 0-9 (adjust this range as needed)
  for (let tokenId = 0; tokenId < 10; tokenId++) {
    try {
      console.log(`🔄 Fetching Token #${tokenId}...`);

      // Add delay to avoid rate limiting
      if (tokenId > 0) {
        await delay(200);
      }

      // Fetch token config and unminted supply with retry logic
      const [config, unminted] = await retryWithBackoff(async () => {
        return Promise.all([
          contract.tokenConfigs(tokenId),
          contract.getUnmintedSupply(tokenId)
        ]);
      });

      const tokenInfo = {
        id: tokenId,
        price: formatEther(config.price),
        priceWei: config.price.toString(),
        whitelistPrice: formatEther(config.whitelistPrice),
        whitelistPriceWei: config.whitelistPrice.toString(),
        maxSupply: config.unlimited ? null : parseInt(config.maxSupply.toString()),
        maxSupplyDisplay: config.unlimited ? "∞" : config.maxSupply.toString(),
        minted: parseInt(config.minted.toString()),
        maxMintPerTx: parseInt(config.maxMintPerTx.toString()),
        mintingActive: config.mintingActive,
        isWhitelistActive: config.isWhitelistActive,
        unlimited: config.unlimited,
        unminted: config.unlimited ? null : parseInt(unminted.toString()),
        unmintedDisplay: config.unlimited ? "Unlimited" : unminted.toString(),
        // Additional computed fields
        isAvailable: config.mintingActive || config.isWhitelistActive,
        isSoldOut: !config.unlimited && parseInt(config.minted.toString()) >= parseInt(config.maxSupply.toString()),
        mintedPercentage: config.unlimited ? 0 : Math.round((parseInt(config.minted.toString()) / parseInt(config.maxSupply.toString())) * 100),
        lastUpdated: Date.now()
      };

      contractData.tokens.push(tokenInfo);

      // Update summary statistics
      totalMinted += tokenInfo.minted;
      if (!tokenInfo.unlimited && tokenInfo.unminted !== null) {
        totalAvailable += tokenInfo.unminted;
      }
      if (tokenInfo.mintingActive) activeTokens++;
      if (tokenInfo.isWhitelistActive) whitelistActiveTokens++;

      console.log(`✅ Token #${tokenId}: ${tokenInfo.price} ETH, Minted: ${tokenInfo.minted}/${tokenInfo.maxSupplyDisplay}`);

    } catch (error) {
      console.error(`❌ Failed to fetch Token #${tokenId}:`, error.message);
      
      // Add error placeholder
      contractData.tokens.push({
        id: tokenId,
        price: "0",
        priceWei: "0",
        whitelistPrice: "0",
        whitelistPriceWei: "0",
        maxSupply: 0,
        maxSupplyDisplay: "0",
        minted: 0,
        maxMintPerTx: 0,
        mintingActive: false,
        isWhitelistActive: false,
        unlimited: false,
        unminted: 0,
        unmintedDisplay: "0",
        isAvailable: false,
        isSoldOut: true,
        mintedPercentage: 0,
        error: true,
        errorMessage: error.message,
        lastUpdated: Date.now()
      });
    }
  }

  // Update summary
  contractData.summary = {
    totalTokens: contractData.tokens.length,
    totalMinted,
    totalAvailable,
    activeTokens,
    whitelistActiveTokens,
    successfulFetches: contractData.tokens.filter(t => !t.error).length,
    failedFetches: contractData.tokens.filter(t => t.error).length
  };

  return contractData;
}

async function saveContractData(data) {
  try {
    // Ensure the directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    await fs.mkdir(outputDir, { recursive: true });

    // Save the data
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`💾 Contract data saved to: ${OUTPUT_FILE}`);

    // Also save a minified version for production
    const minifiedFile = OUTPUT_FILE.replace('.json', '.min.json');
    await fs.writeFile(minifiedFile, JSON.stringify(data));
    console.log(`🗜️  Minified version saved to: ${minifiedFile}`);

    // Save a backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = OUTPUT_FILE.replace('.json', `-backup-${timestamp}.json`);
    await fs.writeFile(backupFile, JSON.stringify(data, null, 2));
    console.log(`🔄 Backup saved to: ${backupFile}`);

  } catch (error) {
    console.error('❌ Failed to save contract data:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🎯 Contract Data Fetcher');
    console.log('========================\n');

    const startTime = Date.now();
    
    // Fetch contract data
    const contractData = await fetchContractData();
    
    // Save to file
    await saveContractData(contractData);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n✨ Summary:');
    console.log(`📊 Total tokens processed: ${contractData.summary.totalTokens}`);
    console.log(`✅ Successful fetches: ${contractData.summary.successfulFetches}`);
    console.log(`❌ Failed fetches: ${contractData.summary.failedFetches}`);
    console.log(`🔥 Active tokens: ${contractData.summary.activeTokens}`);
    console.log(`👑 Whitelist active: ${contractData.summary.whitelistActiveTokens}`);
    console.log(`⏱️  Total time: ${duration.toFixed(2)}s`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
    
    console.log('\n🎉 Contract data fetch completed successfully!');
    console.log('\n💡 To use this data in your app, import it from /contract-data.json');
    
  } catch (error) {
    console.error('\n🚨 Fatal error:', error.message);
    process.exit(1);
  }
}

// Allow script to be run directly
if (require.main === module) {
  main();
}

module.exports = {
  fetchContractData,
  saveContractData
}; 