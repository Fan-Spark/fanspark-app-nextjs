'use client';

import { useCart } from './CartProvider';
import { motion } from 'framer-motion';

export default function Cart({ onBatchMint, onClose }) {
  const { cart, removeFromCart, clearCart } = useCart();
  
  const getTotalTokens = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      const price = item.isWhitelist ? item.whitelistPrice : item.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const handleBatchMint = async () => {
    try {
      await onBatchMint(cart);
      clearCart();
      onClose();
    } catch (error) {
      console.error('Error batch minting:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl w-full max-w-6xl shadow-2xl border border-slate-700/50"
      >
        {/* Main Cart Layout */}
        <div className="flex">
          {/* Left Side - Token Display */}
          <div className="flex-grow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 text-transparent bg-clip-text">
                Selected Tokens
              </h2>
              <button 
                onClick={onClose}
                className="rounded-full p-2 hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Token Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-4">
              {cart.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Your cart is empty</p>
                  <p className="text-slate-500 text-xs mt-1">Add some tokens to get started</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={item.tokenId}
                    className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      {/* Token Preview */}
                      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                        #{item.tokenId}
                      </div>
                      
                      {/* Overlay with quantity */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-center">
                          <div className="text-lg font-semibold">Quantity: {item.quantity}</div>
                          {item.isWhitelist && (
                            <div className="text-sm text-yellow-300">Whitelist Price</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.tokenId)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right Side - Checkout */}
          <div className="w-80 border-l border-slate-700/50 p-6 bg-slate-800/50">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Tokens</span>
                    <span className="font-medium">{getTotalTokens()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Price</span>
                    <span className="font-mono font-medium text-cyan-300">{getTotalPrice()} ETH</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleBatchMint}
                  disabled={cart.length === 0}
                  className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
                >
                  CHECKOUT
                </button>
                
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full py-2 px-4 rounded-lg font-medium text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 