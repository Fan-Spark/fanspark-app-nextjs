#!/usr/bin/env node

/**
 * Contract Transaction Diagnostic Script
 * 
 * This script performs comprehensive testing of smart contract interactions:
 * 1. Connection testing
 * 2. Contract state reading
 * 3. Transaction simulation
 * 4. Gas estimation
 * 5. Actual transaction execution with detailed error analysis
 * 
 * Usage: node scripts/diagnose-contract.js [--dry-run]
 */

const { ethers } = require('ethers');
const { formatEther, parseEther } = require('ethers/lib/utils');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Load contract ABI
const contractABI = require('../src/utils/contractABI.json');

// ERC20 ABI for USDC interaction
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
];

// ==================== Configuration ====================

const CONFIG = {
  // Required
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  
  // Optional
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
  usdcAddress: process.env.USDC_TOKEN_ADDRESS, // USDC token address
  
  // Test parameters
  testTokenId: parseInt(process.env.TEST_TOKEN_ID || '0'),
  testMintAmount: parseInt(process.env.TEST_MINT_AMOUNT || '1'),
  testRecipient: process.env.TEST_RECIPIENT, // Will default to wallet address if not set
  
  // Flags
  dryRun: process.argv.includes('--dry-run'),
  skipActualMint: process.argv.includes('--skip-mint'),
};

// ==================== Utility Functions ====================

function log(emoji, message, data = null) {
  console.log(`${emoji} ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function logError(message, error) {
  console.error(`❌ ${message}`);
  console.error(`   Error: ${error.message}`);
  if (error.reason) console.error(`   Reason: ${error.reason}`);
  if (error.code) console.error(`   Code: ${error.code}`);
  if (error.transaction) {
    console.error(`   Transaction:`, JSON.stringify(error.transaction, null, 2));
  }
  if (error.receipt) {
    console.error(`   Receipt:`, JSON.stringify(error.receipt, null, 2));
  }
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60) + '\n');
}

// Format USDC (6 decimals)
function formatUSDC(value) {
  return (parseInt(value.toString()) / 1000000).toFixed(6);
}

// ==================== Diagnostic Functions ====================

async function validateConfig() {
  logSection('Configuration Validation');
  
  const errors = [];
  
  if (!CONFIG.contractAddress) {
    errors.push('NEXT_PUBLIC_CONTRACT_ADDRESS is not set');
  } else {
    log('✅', `Contract Address: ${CONFIG.contractAddress}`);
  }
  
  if (!CONFIG.rpcUrl) {
    errors.push('NEXT_PUBLIC_RPC_URL is not set');
  } else {
    log('✅', `RPC URL: ${CONFIG.rpcUrl}`);
  }
  
  if (!CONFIG.privateKey) {
    errors.push('PRIVATE_KEY is not set');
  } else {
    log('✅', `Private Key: ${CONFIG.privateKey.substring(0, 10)}...`);
  }
  
  log('✅', `Chain ID: ${CONFIG.chainId}`);
  log('✅', `Test Token ID: ${CONFIG.testTokenId}`);
  log('✅', `Test Mint Amount: ${CONFIG.testMintAmount}`);
  log('✅', `Dry Run Mode: ${CONFIG.dryRun}`);
  
  if (errors.length > 0) {
    console.error('\n❌ Configuration errors:');
    errors.forEach(err => console.error(`   - ${err}`));
    throw new Error('Invalid configuration');
  }
}

async function testConnection(provider) {
  logSection('Network Connection Test');
  
  try {
    const network = await provider.getNetwork();
    log('✅', `Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    if (network.chainId !== CONFIG.chainId) {
      log('⚠️', `Warning: Connected chain ID (${network.chainId}) doesn't match configured chain ID (${CONFIG.chainId})`);
    }
    
    const blockNumber = await provider.getBlockNumber();
    log('✅', `Current block number: ${blockNumber}`);
    
    const gasPrice = await provider.getGasPrice();
    log('✅', `Current gas price: ${formatEther(gasPrice)} ETH (${gasPrice.toString()} wei)`);
    
    return true;
  } catch (error) {
    logError('Failed to connect to network', error);
    return false;
  }
}

async function testWallet(wallet, provider) {
  logSection('Wallet Test');
  
  try {
    const address = wallet.address;
    log('✅', `Wallet address: ${address}`);
    
    const balance = await provider.getBalance(address);
    log('✅', `Wallet balance: ${formatEther(balance)} ETH`);
    
    if (balance.eq(0)) {
      log('⚠️', 'Warning: Wallet has zero balance. You need ETH for gas fees.');
    }
    
    const nonce = await provider.getTransactionCount(address);
    log('✅', `Wallet nonce: ${nonce}`);
    
    return { address, balance, nonce };
  } catch (error) {
    logError('Failed to get wallet info', error);
    return null;
  }
}

async function testContractRead(contract) {
  logSection('Contract Read Test');
  
  try {
    // Test basic contract reads
    log('📖', 'Reading contract state...');
    
    // Get token config
    const config = await contract.tokenConfigs(CONFIG.testTokenId);
    log('✅', `Token ${CONFIG.testTokenId} configuration:`, {
      price: `${formatUSDC(config.price)} USDC`,
      priceWei: config.price.toString(),
      whitelistPrice: `${formatUSDC(config.whitelistPrice)} USDC`,
      whitelistPriceWei: config.whitelistPrice.toString(),
      maxSupply: config.unlimited ? 'Unlimited' : config.maxSupply.toString(),
      minted: config.minted.toString(),
      maxMintPerTx: config.maxMintPerTx.toString(),
      mintingActive: config.mintingActive,
      isWhitelistActive: config.isWhitelistActive,
      unlimited: config.unlimited,
      tokenURI: config.tokenURI
    });
    
    // Get unminted supply
    const unminted = await contract.getUnmintedSupply(CONFIG.testTokenId);
    log('✅', `Unminted supply: ${unminted.toString()}`);
    
    // Check if token exists
    const exists = await contract.exists(CONFIG.testTokenId);
    log('✅', `Token exists: ${exists}`);
    
    // Get total supply for specific token (using full signature due to overloaded function)
    const totalSupply = await contract['totalSupply(uint256)'](CONFIG.testTokenId);
    log('✅', `Total supply for token: ${totalSupply.toString()}`);
    
    // Check transfer lock
    const transferUnlocked = await contract.transferUnlocked();
    log('✅', `Transfers unlocked: ${transferUnlocked}`);
    
    // Check merkle root (for whitelist)
    const merkleRoot = await contract.merkleRoot();
    log('✅', `Merkle root: ${merkleRoot}`);
    
    return {
      config,
      unminted,
      exists,
      totalSupply,
      transferUnlocked,
      merkleRoot
    };
  } catch (error) {
    logError('Failed to read contract state', error);
    return null;
  }
}

async function checkUSDCPayment(wallet, provider, totalPrice) {
  logSection('USDC Payment Check');
  
  // Try to detect USDC address if not provided
  const knownUSDCAddresses = {
    // Base Mainnet
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    // Base Sepolia
    84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    // Ethereum Mainnet
    1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  };
  
  const usdcAddress = CONFIG.usdcAddress || knownUSDCAddresses[CONFIG.chainId];
  
  if (!usdcAddress) {
    log('⚠️', 'USDC address not configured. Assuming native token payment.');
    return { usesUSDC: false, hasEnough: true, needsApproval: false };
  }
  
  try {
    log('🔍', `Checking USDC token at: ${usdcAddress}`);
    const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, provider);
    
    // Get USDC balance
    const balance = await usdc.balanceOf(wallet.address);
    const symbol = await usdc.symbol();
    const decimals = await usdc.decimals();
    
    log('✅', `Token: ${symbol}`);
    log('✅', `Your balance: ${formatUSDC(balance)} ${symbol}`);
    log('✅', `Required: ${formatUSDC(totalPrice)} ${symbol}`);
    
    const hasEnough = balance.gte(totalPrice);
    if (!hasEnough) {
      log('❌', `Insufficient ${symbol} balance!`);
      return { usesUSDC: true, hasEnough: false, needsApproval: false, usdcAddress, balance };
    }
    
    // Check allowance
    const allowance = await usdc.allowance(wallet.address, CONFIG.contractAddress);
    log('📋', `Current allowance: ${formatUSDC(allowance)} ${symbol}`);
    
    const needsApproval = allowance.lt(totalPrice);
    if (needsApproval) {
      log('⚠️', `Need to approve contract to spend ${symbol}`);
    } else {
      log('✅', `Sufficient allowance already granted`);
    }
    
    return {
      usesUSDC: true,
      hasEnough,
      needsApproval,
      usdcAddress,
      balance,
      allowance,
      symbol
    };
    
  } catch (error) {
    log('⚠️', `Could not check USDC: ${error.message}`);
    log('⚠️', 'Assuming native token payment...');
    return { usesUSDC: false, hasEnough: true, needsApproval: false };
  }
}

async function approveUSDC(wallet, usdcAddress, totalPrice) {
  logSection('USDC Approval');
  
  if (CONFIG.dryRun) {
    log('⏭️', 'Skipping approval (dry run mode)');
    return false;
  }
  
  try {
    const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, wallet);
    
    // Approve a bit more to allow for multiple mints
    const approvalAmount = totalPrice.mul(10);
    log('🚀', `Approving ${formatUSDC(approvalAmount)} USDC...`);
    
    const tx = await usdc.approve(CONFIG.contractAddress, approvalAmount);
    log('✅', `Approval tx sent: ${tx.hash}`);
    log('⏳', 'Waiting for confirmation...');
    
    const receipt = await tx.wait();
    log('✅', `Approval confirmed in block ${receipt.blockNumber}`);
    
    return true;
  } catch (error) {
    logError('Failed to approve USDC', error);
    return false;
  }
}

async function analyzeTokenState(contractData) {
  logSection('Token State Analysis');
  
  const { config, unminted } = contractData;
  const issues = [];
  const warnings = [];
  
  // Check if minting is active
  if (!config.mintingActive) {
    issues.push('❌ Minting is NOT active for this token');
  } else {
    log('✅', 'Minting is active');
  }
  
  // Check supply
  if (!config.unlimited) {
    const remaining = unminted.toNumber();
    if (remaining === 0) {
      issues.push('❌ Token is SOLD OUT (no remaining supply)');
    } else if (remaining < CONFIG.testMintAmount) {
      issues.push(`❌ Insufficient supply: trying to mint ${CONFIG.testMintAmount} but only ${remaining} available`);
    } else {
      log('✅', `Sufficient supply: ${remaining} available`);
    }
  } else {
    log('✅', 'Unlimited supply');
  }
  
  // Check max mint per tx
  if (CONFIG.testMintAmount > config.maxMintPerTx.toNumber()) {
    issues.push(`❌ Mint amount (${CONFIG.testMintAmount}) exceeds max per tx (${config.maxMintPerTx.toNumber()})`);
  } else {
    log('✅', `Mint amount within limits (max ${config.maxMintPerTx.toNumber()} per tx)`);
  }
  
  // Check price
  const pricePerToken = config.price;
  const totalPrice = pricePerToken.mul(CONFIG.testMintAmount);
  
  // Detect payment type based on price magnitude
  const isLikelyUSDC = totalPrice.lt(ethers.utils.parseEther('0.01')); // Less than 0.01 ETH likely means USDC
  
  if (isLikelyUSDC) {
    log('💰', `Price per token: ${formatUSDC(pricePerToken)} USDC (likely)`);
    log('💰', `Total price for ${CONFIG.testMintAmount} token(s): ${formatUSDC(totalPrice)} USDC (likely)`);
    warnings.push('⚠️ Contract appears to use USDC for payment, not native ETH');
  } else {
    log('💰', `Price per token: ${formatEther(pricePerToken)} ETH`);
    log('💰', `Total price for ${CONFIG.testMintAmount} token(s): ${formatEther(totalPrice)} ETH`);
  }
  
  // Whitelist check
  if (config.isWhitelistActive) {
    warnings.push('⚠️ Whitelist is active - you may need merkle proof for regular mint');
  }
  
  // Print issues
  if (issues.length > 0) {
    console.log('\n🚨 Issues detected:');
    issues.forEach(issue => console.log(`   ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  return {
    canProceed: issues.length === 0,
    issues,
    warnings,
    totalPrice,
    isLikelyUSDC
  };
}

async function estimateGas(contract, walletAddress, totalPrice, usesUSDC) {
  logSection('Gas Estimation');
  
  try {
    const recipient = CONFIG.testRecipient || walletAddress;
    log('🔍', `Estimating gas for mint transaction...`);
    log('📍', `Recipient: ${recipient}`);
    log('💰', `Payment type: ${usesUSDC ? 'USDC (ERC20)' : 'Native ETH'}`);
    
    // For USDC payments, don't send native value
    const txParams = usesUSDC ? {} : { value: totalPrice };
    
    const gasEstimate = await contract.estimateGas.mint(
      CONFIG.testTokenId,
      CONFIG.testMintAmount,
      recipient,
      txParams
    );
    
    log('✅', `Estimated gas: ${gasEstimate.toString()} units`);
    
    // Get current gas price
    const gasPrice = await contract.provider.getGasPrice();
    const gasCost = gasEstimate.mul(gasPrice);
    
    log('✅', `Gas price: ${formatEther(gasPrice)} ETH`);
    log('✅', `Estimated gas cost: ${formatEther(gasCost)} ETH`);
    
    return { gasEstimate, gasPrice, gasCost };
  } catch (error) {
    logError('Gas estimation failed', error);
    
    // Try to parse the error for more details
    if (error.error && error.error.data) {
      console.error('   Error data:', error.error.data);
    }
    
    // Common error reasons
    if (error.message.includes('insufficient funds')) {
      console.error('   💡 Likely cause: Insufficient balance for transaction');
    } else if (error.message.includes('execution reverted')) {
      console.error('   💡 Likely cause: Contract revert');
      console.error('   💡 Possible reasons:');
      console.error('      - Insufficient USDC balance');
      console.error('      - USDC not approved for contract');
      console.error('      - Minting not active');
      console.error('      - Max supply reached');
    } else if (error.reason) {
      console.error('   💡 Likely cause:', error.reason);
    }
    
    return null;
  }
}

async function simulateTransaction(contract, walletAddress, totalPrice, usesUSDC) {
  logSection('Transaction Simulation');
  
  try {
    const recipient = CONFIG.testRecipient || walletAddress;
    log('🧪', 'Simulating transaction with callStatic...');
    log('💰', `Payment: ${usesUSDC ? formatUSDC(totalPrice) + ' USDC' : formatEther(totalPrice) + ' ETH'}`);
    
    // For USDC payments, don't send native value
    const txParams = usesUSDC ? {} : { value: totalPrice };
    
    // Use callStatic to simulate without sending
    await contract.callStatic.mint(
      CONFIG.testTokenId,
      CONFIG.testMintAmount,
      recipient,
      txParams
    );
    
    log('✅', 'Transaction simulation successful!');
    log('✅', 'The transaction should succeed if sent to the blockchain');
    
    return true;
  } catch (error) {
    logError('Transaction simulation failed', error);
    
    // Detailed error analysis
    console.log('\n🔍 Error Analysis:');
    
    if (error.message.includes('insufficient funds')) {
      console.log('   💡 Issue: Insufficient balance');
      if (usesUSDC) {
        console.log('   💡 Solution: Add USDC tokens to your wallet');
      } else {
        console.log('   💡 Solution: Add ETH to your wallet');
      }
    } else if (error.message.includes('ERC20: insufficient allowance') || error.message.includes('allowance')) {
      console.log('   💡 Issue: USDC not approved for spending');
      console.log('   💡 Solution: Run the script again to approve USDC');
    } else if (error.message.includes('ERC20: transfer amount exceeds balance')) {
      console.log('   💡 Issue: Insufficient USDC balance');
      console.log('   💡 Solution: Add more USDC to your wallet');
    } else if (error.message.includes('exceeds max mint')) {
      console.log('   💡 Issue: Trying to mint more than allowed per transaction');
      console.log('   💡 Solution: Reduce mint amount or check maxMintPerTx setting');
    } else if (error.message.includes('not active')) {
      console.log('   💡 Issue: Minting is not active for this token');
      console.log('   💡 Solution: Activate minting or use a different token');
    } else if (error.message.includes('sold out') || error.message.includes('max supply')) {
      console.log('   💡 Issue: Token sold out or insufficient supply');
      console.log('   💡 Solution: Increase max supply or use a different token');
    } else if (error.message.includes('whitelist')) {
      console.log('   💡 Issue: Whitelist is active');
      console.log('   💡 Solution: Use mintWhitelist function with valid merkle proof');
    } else if (error.errorName) {
      console.log(`   💡 Contract Error: ${error.errorName}`);
    } else {
      console.log('   💡 Common causes:');
      console.log('      - USDC balance too low');
      console.log('      - USDC approval not granted');
      console.log('      - Contract conditions not met');
    }
    
    return false;
  }
}

async function executeMint(contract, walletAddress, totalPrice, gasEstimate, usesUSDC) {
  logSection('Transaction Execution');
  
  if (CONFIG.dryRun || CONFIG.skipActualMint) {
    log('⏭️', 'Skipping actual mint (dry run mode)');
    return null;
  }
  
  try {
    const recipient = CONFIG.testRecipient || walletAddress;
    
    log('🚀', 'Sending mint transaction...');
    log('📍', `Token ID: ${CONFIG.testTokenId}`);
    log('📍', `Amount: ${CONFIG.testMintAmount}`);
    log('📍', `Recipient: ${recipient}`);
    
    if (usesUSDC) {
      log('📍', `Payment: ${formatUSDC(totalPrice)} USDC (ERC20)`);
    } else {
      log('📍', `Value: ${formatEther(totalPrice)} ETH`);
    }
    
    // For USDC payments, don't send native value
    const txParams = {
      gasLimit: gasEstimate ? gasEstimate.mul(120).div(100) : undefined, // 20% buffer
    };
    
    if (!usesUSDC) {
      txParams.value = totalPrice;
    }
    
    const tx = await contract.mint(
      CONFIG.testTokenId,
      CONFIG.testMintAmount,
      recipient,
      txParams
    );
    
    log('✅', `Transaction sent: ${tx.hash}`);
    log('⏳', 'Waiting for confirmation...');
    
    const receipt = await tx.wait();
    
    log('✅', `Transaction confirmed in block ${receipt.blockNumber}`);
    log('✅', `Gas used: ${receipt.gasUsed.toString()}`);
    log('✅', `Status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);
    
    // Parse events
    if (receipt.events) {
      console.log('\n📋 Events:');
      receipt.events.forEach(event => {
        if (event.event) {
          console.log(`   ${event.event}:`, event.args);
        }
      });
    }
    
    return receipt;
  } catch (error) {
    logError('Transaction execution failed', error);
    
    // Check if transaction was sent but failed
    if (error.transaction) {
      console.log('\n🔍 Transaction was sent but failed:');
      console.log(`   Hash: ${error.transactionHash || 'Unknown'}`);
    }
    
    return null;
  }
}

async function verifyMintResult(contract, walletAddress, beforeBalance) {
  logSection('Mint Verification');
  
  try {
    const recipient = CONFIG.testRecipient || walletAddress;
    const afterBalance = await contract.balanceOf(recipient, CONFIG.testTokenId);
    
    log('📊', `Balance before: ${beforeBalance.toString()}`);
    log('📊', `Balance after: ${afterBalance.toString()}`);
    log('📊', `Difference: ${afterBalance.sub(beforeBalance).toString()}`);
    
    if (afterBalance.gt(beforeBalance)) {
      log('✅', 'Mint successful! Balance increased.');
    } else {
      log('⚠️', 'Warning: Balance did not increase');
    }
    
    return afterBalance;
  } catch (error) {
    logError('Failed to verify mint result', error);
    return null;
  }
}

// ==================== Main Function ====================

async function main() {
  console.log('🔬 Contract Transaction Diagnostic Tool');
  console.log('========================================\n');
  
  try {
    // Step 1: Validate configuration
    await validateConfig();
    
    // Step 2: Initialize provider and wallet
    logSection('Initialization');
    const provider = new ethers.providers.JsonRpcProvider(CONFIG.rpcUrl);
    const wallet = new ethers.Wallet(CONFIG.privateKey, provider);
    const contract = new ethers.Contract(CONFIG.contractAddress, contractABI, wallet);
    
    log('✅', 'Provider initialized');
    log('✅', 'Wallet initialized');
    log('✅', 'Contract instance created');
    
    // Step 3: Test connection
    const connected = await testConnection(provider);
    if (!connected) {
      throw new Error('Failed to connect to network');
    }
    
    // Step 4: Test wallet
    const walletInfo = await testWallet(wallet, provider);
    if (!walletInfo) {
      throw new Error('Failed to get wallet information');
    }
    
    // Step 5: Read contract state
    const contractData = await testContractRead(contract);
    if (!contractData) {
      throw new Error('Failed to read contract state');
    }
    
    // Step 6: Analyze token state
    const analysis = await analyzeTokenState(contractData);
    if (!analysis.canProceed) {
      console.log('\n🛑 Cannot proceed with mint due to issues listed above');
      process.exit(1);
    }
    
    // Step 7: Check USDC balance and approval (if using USDC)
    const usdcCheck = await checkUSDCPayment(wallet, provider, analysis.totalPrice);
    
    if (usdcCheck.usesUSDC) {
      if (!usdcCheck.hasEnough) {
        throw new Error(`Insufficient USDC balance. Need ${formatUSDC(analysis.totalPrice)} but have ${formatUSDC(usdcCheck.balance)}`);
      }
      
      if (usdcCheck.needsApproval) {
        log('⚠️', 'USDC approval required before minting');
        const approved = await approveUSDC(wallet, usdcCheck.usdcAddress, analysis.totalPrice);
        if (!approved && !CONFIG.dryRun) {
          throw new Error('Failed to approve USDC. Cannot proceed with mint.');
        }
      }
    } else {
      // Native token payment
      if (walletInfo.balance.lt(analysis.totalPrice)) {
        throw new Error(`Insufficient ETH balance. Need ${formatEther(analysis.totalPrice)} but have ${formatEther(walletInfo.balance)}`);
      }
    }
    
    // Step 8: Estimate gas
    const gasInfo = await estimateGas(contract, walletInfo.address, analysis.totalPrice, usdcCheck.usesUSDC);
    if (!gasInfo) {
      throw new Error('Gas estimation failed - transaction will likely fail');
    }
    
    // Step 9: Check if wallet has enough ETH for gas
    if (walletInfo.balance.lt(gasInfo.gasCost)) {
      throw new Error(`Insufficient ETH for gas. Need ${formatEther(gasInfo.gasCost)} ETH but only have ${formatEther(walletInfo.balance)} ETH`);
    }
    
    // Step 10: Simulate transaction
    const simSuccess = await simulateTransaction(contract, walletInfo.address, analysis.totalPrice, usdcCheck.usesUSDC);
    if (!simSuccess) {
      throw new Error('Transaction simulation failed - see error details above');
    }
    
    // Step 11: Get balance before mint
    const recipient = CONFIG.testRecipient || walletInfo.address;
    const balanceBefore = await contract.balanceOf(recipient, CONFIG.testTokenId);
    log('📊', `Current balance of token ${CONFIG.testTokenId}: ${balanceBefore.toString()}`);
    
    // Step 12: Execute mint (if not dry run)
    if (!CONFIG.dryRun && !CONFIG.skipActualMint) {
      const receipt = await executeMint(contract, walletInfo.address, analysis.totalPrice, gasInfo.gasEstimate, usdcCheck.usesUSDC);
      
      if (receipt && receipt.status === 1) {
        await verifyMintResult(contract, walletInfo.address, balanceBefore);
      }
    }
    
    // Final summary
    logSection('Diagnostic Complete');
    log('✅', 'All diagnostic checks passed!');
    
    if (CONFIG.dryRun || CONFIG.skipActualMint) {
      log('ℹ️', 'Dry run mode - no transaction was sent');
      log('💡', 'Run without --dry-run or --skip-mint to execute the mint');
    } else {
      log('✅', 'Mint transaction completed');
    }
    
  } catch (error) {
    logSection('Diagnostic Failed');
    logError('Fatal error', error);
    process.exit(1);
  }
}

// Run the diagnostic
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { main };

