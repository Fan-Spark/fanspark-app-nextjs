import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Heart, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useDynamicWallet } from '@/hooks/useDynamicWallet';
import { ethers } from 'ethers';

const DonationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Add safety check for Dynamic context
  let walletData;
  try {
    walletData = useDynamicWallet();
  } catch (error) {
    // If Dynamic context is not available, don't render
    console.warn('Dynamic context not available for DonationModal:', error);
    return null;
  }
  
  const { primaryWallet, walletAddress, isConnected } = walletData || {};
  
  const donationWalletAddress = process.env.NEXT_PUBLIC_DONATION_WALLET_ADDRESS;

  // Don't render if no donation wallet is configured
  if (!donationWalletAddress) {
    return null;
  }

  // Validate amount input
  const isValidAmount = () => {
    const numAmount = parseInt(amount);
    return numAmount >= 1 && numAmount <= 1000000; // Minimum $1 USDC
  };

  // Format amount for display (whole numbers only)
  const formatAmount = (value) => {
    const num = parseInt(value);
    if (isNaN(num)) return '0';
    return num.toString();
  };

  // Handle donation
  const handleDonate = async () => {
    if (!isValidAmount() || !isConnected || !donationWalletAddress) {
      return;
    }

    setIsProcessing(true);
    setStatus('processing');
    setErrorMessage('');

    try {
      // USDC contract address on Base
      const usdcContractAddress = '0x7f27352d5f83db87a5a3e00f4b07cc2138d8ee52';
      
      // Convert USDC amount to wei (6 decimal places for USDC)
      const amountInWei = ethers.utils.parseUnits(amount, 6);
      
      // Create ERC-20 transfer function call data
      const transferFunctionSignature = '0xa9059cbb'; // transfer(address,uint256)
      const recipientAddress = donationWalletAddress.slice(2).padStart(64, '0'); // Remove 0x and pad to 32 bytes
      const amountHex = amountInWei.toHexString().slice(2).padStart(64, '0'); // Convert to hex and pad to 32 bytes
      const data = transferFunctionSignature + recipientAddress + amountHex;
      
      // Get the wallet client from Dynamic.xyz
      const walletClient = await primaryWallet.getWalletClient();
      
      // Create ERC-20 transfer transaction
      const transaction = {
        to: usdcContractAddress,
        value: '0x0', // No ETH value for ERC-20 transfer
        data: data,
      };

      console.log('Sending USDC donation transaction:', transaction);
      console.log(`Transferring ${amount} USDC to ${donationWalletAddress}`);
      
      // Send the transaction
      const txHash = await walletClient.sendTransaction(transaction);
      console.log('USDC donation transaction sent, hash:', txHash);
      
      setStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setAmount('');
        setStatus('idle');
        setErrorMessage('');
        setIsProcessing(false);
        setIsOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Error sending donation:', error);
      setStatus('error');
      
      // Parse and handle specific error types
      let friendlyMessage = "Donation failed";
      
      if (error.message) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes('insufficient funds') || msg.includes('exceeds the balance')) {
          friendlyMessage = "Insufficient USDC balance - you don't have enough USDC tokens to complete this donation";
        } else if (msg.includes('user rejected') || msg.includes('user denied')) {
          friendlyMessage = "Donation was cancelled by user";
        } else if (msg.includes('gas required exceeds allowance') || msg.includes('out of gas')) {
          friendlyMessage = "Transaction would fail due to gas limit";
        } else if (msg.includes('network') || msg.includes('connection')) {
          friendlyMessage = "Network connection issue - please check your internet and try again";
        } else {
          friendlyMessage = error.message;
        }
      }
      
      setErrorMessage(friendlyMessage);
      setIsProcessing(false);
    }
  };

  // Reset form and close modal
  const closeModal = () => {
    setAmount('');
    setStatus('idle');
    setErrorMessage('');
    setIsProcessing(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button 
        variant="outline" 
        className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border-pink-500/30 text-pink-600 hover:bg-pink-500/20 hover:border-pink-500/50"
        onClick={() => setIsOpen(true)}
      >
        <Heart className="w-4 h-4 mr-2" />
        Donate Any Amount
      </Button>
      
      {/* Custom Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4 border">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <h2 className="text-lg font-semibold">Support FanSpark</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="space-y-6">
              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Thank you for your donation! 🎉</span>
                </div>
              )}
              
              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}
              
              {/* Donation Form */}
              {status === 'idle' && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="donation-amount" className="text-sm font-medium">
                        Donation Amount (USDC)
                      </Label>
                      <div className="relative mt-1">
                                              <Input
                        id="donation-amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1"
                        min="1"
                        max="1000000"
                        step="1"
                        className="pr-20"
                      />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Badge variant="secondary" className="text-xs">
                            USDC
                          </Badge>
                        </div>
                      </div>
                      {amount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          You will donate: ${formatAmount(amount)} USDC
                        </p>
                      )}
                    </div>
                    
                    {/* Wallet Connection Status */}
                    {!isConnected ? (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600">
                        <p className="text-sm">Please connect your wallet to make a donation</p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600">
                        <p className="text-sm">
                          Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDonate}
                      disabled={!isValidAmount() || !isConnected || isProcessing}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Donate Now
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
              
              {/* Success State */}
              {status === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-600">Donation Successful!</h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for supporting FanSpark! Your contribution helps us continue building amazing experiences.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationModal;
