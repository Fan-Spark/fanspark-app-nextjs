/**
 * USDC Payment Utility
 * 
 * Handles USDC (ERC20) token approvals and checks for NFT minting
 */

import { ethers } from 'ethers';

// ERC20 ABI for USDC interactions
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
];

// Known USDC addresses for different networks
export const USDC_ADDRESSES = {
  // Ethereum Mainnet
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  // Base Mainnet
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  // Base Sepolia
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  // Flow EVM Mainnet
  747: '0x7f27352d5f83db87a5a3e00f4b07cc2138d8ee52',
  // Flow EVM Testnet
  545: '0xef6cd830ba4d1d65f4b50f2e7b2b6e5eb86f4ce8',
};

/**
 * Get USDC token address for current chain
 */
export function getUSDCAddress(chainId) {
  const address = USDC_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`USDC address not configured for chain ID ${chainId}`);
  }
  return address;
}

/**
 * Format USDC amount (6 decimals)
 */
export function formatUSDC(value) {
  if (!value) return '0';
  return (parseInt(value.toString()) / 1000000).toFixed(6);
}

/**
 * Check if payment should use USDC based on price
 * Prices less than 0.01 ETH likely indicate USDC payment
 */
export function shouldUseUSDC(price) {
  try {
    const priceInEth = ethers.utils.parseEther(price.toString());
    const threshold = ethers.utils.parseEther('0.01');
    return priceInEth.lt(threshold);
  } catch {
    return false;
  }
}

/**
 * Check USDC balance and allowance
 * 
 * @param {Object} provider - Ethers provider
 * @param {string} walletAddress - User's wallet address
 * @param {string} contractAddress - NFT contract address that will receive approval
 * @param {ethers.BigNumber} requiredAmount - Amount of USDC required
 * @param {number} chainId - Network chain ID
 * @returns {Promise<Object>} Balance and allowance info
 */
export async function checkUSDCPayment(provider, walletAddress, contractAddress, requiredAmount, chainId) {
  try {
    const usdcAddress = getUSDCAddress(chainId);
    const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, provider);
    
    // Get balance
    const balance = await usdc.balanceOf(walletAddress);
    const symbol = await usdc.symbol();
    
    // Get allowance
    const allowance = await usdc.allowance(walletAddress, contractAddress);
    
    const hasEnoughBalance = balance.gte(requiredAmount);
    const hasEnoughAllowance = allowance.gte(requiredAmount);
    
    return {
      balance,
      allowance,
      symbol,
      usdcAddress,
      hasEnoughBalance,
      hasEnoughAllowance,
      needsApproval: !hasEnoughAllowance,
      balanceFormatted: formatUSDC(balance),
      allowanceFormatted: formatUSDC(allowance),
      requiredFormatted: formatUSDC(requiredAmount),
    };
  } catch (error) {
    console.error('Error checking USDC payment:', error);
    throw new Error(`Failed to check USDC balance: ${error.message}`);
  }
}

/**
 * Approve USDC spending for contract
 * 
 * @param {Object} walletClient - Wallet client from Dynamic.xyz
 * @param {string} contractAddress - Contract to approve
 * @param {ethers.BigNumber} amount - Amount to approve
 * @param {number} chainId - Network chain ID
 * @returns {Promise<string>} Transaction hash
 */
export async function approveUSDC(walletClient, contractAddress, amount, chainId) {
  try {
    const usdcAddress = getUSDCAddress(chainId);
    
    // Approve 10x the required amount to allow for multiple mints
    const approvalAmount = amount.mul(10);
    
    console.log(`Approving ${formatUSDC(approvalAmount)} USDC for ${contractAddress}`);
    
    // Create approval transaction data
    const usdcInterface = new ethers.utils.Interface(ERC20_ABI);
    const approvalData = usdcInterface.encodeFunctionData('approve', [
      contractAddress,
      approvalAmount
    ]);
    
    // Send approval transaction
    const txHash = await walletClient.sendTransaction({
      to: usdcAddress,
      data: approvalData,
    });
    
    console.log('USDC approval transaction sent:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error approving USDC:', error);
    throw new Error(`Failed to approve USDC: ${error.message}`);
  }
}

/**
 * Wait for transaction confirmation
 * 
 * @param {Object} provider - Ethers provider  
 * @param {string} txHash - Transaction hash
 * @param {number} confirmations - Number of confirmations to wait for (default: 1)
 * @returns {Promise<Object>} Transaction receipt
 */
export async function waitForTransaction(provider, txHash, confirmations = 1) {
  try {
    console.log(`Waiting for transaction ${txHash} (${confirmations} confirmations)...`);
    const receipt = await provider.waitForTransaction(txHash, confirmations);
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    return receipt;
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

/**
 * Full USDC payment flow: check balance, approve if needed
 * 
 * @param {Object} provider - Ethers provider
 * @param {Object} walletClient - Wallet client from Dynamic.xyz
 * @param {string} walletAddress - User's wallet address
 * @param {string} contractAddress - NFT contract address
 * @param {ethers.BigNumber} requiredAmount - Amount of USDC required
 * @param {number} chainId - Network chain ID
 * @returns {Promise<Object>} Payment status
 */
export async function handleUSDCPayment(provider, walletClient, walletAddress, contractAddress, requiredAmount, chainId) {
  console.log('🔍 Checking USDC payment requirements...');
  
  // Check balance and allowance
  const paymentInfo = await checkUSDCPayment(provider, walletAddress, contractAddress, requiredAmount, chainId);
  
  console.log('USDC Payment Info:', {
    balance: paymentInfo.balanceFormatted,
    allowance: paymentInfo.allowanceFormatted,
    required: paymentInfo.requiredFormatted,
    symbol: paymentInfo.symbol,
  });
  
  // Check if user has enough USDC
  if (!paymentInfo.hasEnoughBalance) {
    throw new Error(
      `Insufficient ${paymentInfo.symbol} balance. ` +
      `You have ${paymentInfo.balanceFormatted} ${paymentInfo.symbol} ` +
      `but need ${paymentInfo.requiredFormatted} ${paymentInfo.symbol}`
    );
  }
  
  // Check if approval is needed
  if (paymentInfo.needsApproval) {
    console.log('⚠️ USDC approval required');
    
    // Send approval transaction
    const approvalTxHash = await approveUSDC(walletClient, contractAddress, requiredAmount, chainId);
    
    // Wait for approval to be confirmed
    await waitForTransaction(provider, approvalTxHash, 1);
    
    console.log('✅ USDC approved successfully');
  } else {
    console.log('✅ USDC already approved');
  }
  
  return {
    approved: true,
    balance: paymentInfo.balance,
    symbol: paymentInfo.symbol,
  };
}

