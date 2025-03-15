import { useState, useEffect } from "react";

export default function BatchMintModal({ tokens, onClose, onBatchMint, whitelistStatus }) {
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [useWhitelist, setUseWhitelist] = useState(true);

  // Check if current user has any whitelist allocations
  const hasWhitelistAllocation = whitelistStatus?.isWhitelisted || false;
  
  useEffect(() => {
    // Reset selections when modal opens
    setSelectedTokens([]);
  }, []);

  const toggleToken = (tokenId) => {
    const existingIndex = selectedTokens.findIndex(item => item.tokenId === tokenId);
    
    if (existingIndex !== -1) {
      // Remove token if already selected
      setSelectedTokens(selectedTokens.filter(item => item.tokenId !== tokenId));
    } else {
      // Add token with amount 1
      const token = tokens.find(t => t.id === tokenId);
      const isTokenWhitelisted = isWhitelistedToken(tokenId);
      
      // Default to the minimum of max mint per tx and whitelist allocation if using whitelist
      let defaultAmount = 1;
      if (useWhitelist && isTokenWhitelisted && token.isWhitelistActive) {
        const whitelistAllocation = getWhitelistAllocation(tokenId);
        defaultAmount = Math.min(parseInt(token.maxMintPerTx), whitelistAllocation);
      }
      
      setSelectedTokens([...selectedTokens, { 
        tokenId, 
        amount: defaultAmount,
        useWhitelist: useWhitelist && isTokenWhitelisted && token.isWhitelistActive
      }]);
    }
  };

  const updateAmount = (tokenId, amount) => {
    const token = tokens.find(t => t.id === tokenId);
    
    // Get the max allowed based on whitelist status
    let maxAmount = parseInt(token.maxMintPerTx);
    const selectedToken = selectedTokens.find(item => item.tokenId === tokenId);
    
    if (selectedToken?.useWhitelist) {
      const whitelistAllocation = getWhitelistAllocation(tokenId);
      maxAmount = Math.min(maxAmount, whitelistAllocation);
    }
    
    if (amount > 0 && amount <= maxAmount) {
      setSelectedTokens(selectedTokens.map(item => 
        item.tokenId === tokenId ? { ...item, amount } : item
      ));
    }
  };
  
  const toggleWhitelistForToken = (tokenId) => {
    setSelectedTokens(selectedTokens.map(item => {
      if (item.tokenId === tokenId) {
        const newUseWhitelist = !item.useWhitelist;
        
        // If switching to whitelist, check if amount exceeds whitelist allocation
        if (newUseWhitelist) {
          const token = tokens.find(t => t.id === tokenId);
          const whitelistAllocation = getWhitelistAllocation(tokenId);
          const newAmount = Math.min(item.amount, whitelistAllocation);
          
          return { 
            ...item, 
            useWhitelist: newUseWhitelist,
            amount: newAmount
          };
        }
        
        return { ...item, useWhitelist: newUseWhitelist };
      }
      return item;
    }));
  };

  const isWhitelistedToken = (tokenId) => {
    return whitelistStatus?.tokens?.some(entry => entry.tokenId === tokenId) || false;
  };

  const getWhitelistAllocation = (tokenId) => {
    const entry = whitelistStatus?.tokens?.find(entry => entry.tokenId === tokenId);
    return entry ? entry.amount : 0;
  };

  const getTotalPrice = () => {
    return selectedTokens.reduce((total, item) => {
      const token = tokens.find(t => t.id === item.tokenId);
      const price = item.useWhitelist ? parseFloat(token.whitelistPrice) : parseFloat(token.price);
      return total + (price * item.amount);
    }, 0).toFixed(4);
  };

  // Generate a token-specific gradient based on the token ID
  const getTokenGradient = (id) => {
    const gradients = [
      'from-cyan-500 to-blue-500',      // Token 0
      'from-indigo-500 to-purple-500',  // Token 1
      'from-purple-500 to-pink-500',    // Token 2
      'from-pink-500 to-rose-500',      // Token 3
      'from-rose-500 to-orange-500',    // Token 4
      'from-orange-500 to-amber-500',   // Token 5
      'from-amber-500 to-yellow-500',   // Token 6
      'from-yellow-500 to-lime-500',    // Token 7
      'from-lime-500 to-green-500',     // Token 8
      'from-green-500 to-emerald-500',  // Token 9
    ];
    return gradients[id % gradients.length];
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              Batch Mint
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-300 mb-4 text-sm">
              Select multiple tokens to mint in a single transaction:
            </p>
            
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {tokens.map(token => {
                // Check if this token ID is in the user's whitelist
                const isTokenWhitelisted = isWhitelistedToken(token.id);
                const whitelistAllocation = getWhitelistAllocation(token.id);
                const isSelected = selectedTokens.some(item => item.tokenId === token.id);
                const selectedItem = selectedTokens.find(item => item.tokenId === token.id);
                const isUsingWhitelist = selectedItem?.useWhitelist || false;
                
                return (
                  <div 
                    key={token.id}
                    className={`p-4 rounded-lg transition-all selectable ${
                      isSelected
                        ? isUsingWhitelist 
                          ? "border border-yellow-500/30 bg-yellow-900/10" 
                          : "border border-cyan-500/30 bg-cyan-900/10"
                        : "border border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                    onClick={() => toggleToken(token.id)}
                  >
                    <div className="flex items-center mb-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`token-${token.id}`}
                          checked={isSelected}
                          onChange={() => toggleToken(token.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border ${
                          isSelected
                            ? isUsingWhitelist
                              ? "bg-yellow-500 border-yellow-400"
                              : "bg-cyan-500 border-cyan-400"
                            : "border-slate-500 bg-slate-700"
                        } flex items-center justify-center`}>
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <label htmlFor={`token-${token.id}`} className="ml-3 flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-2 h-10 rounded-sm bg-gradient-to-b ${getTokenGradient(token.id)} mr-2`}></div>
                            <div>
                              <span className="font-medium">Token #{token.id}</span>
                              <span className="ml-2 text-xs text-slate-400">
                                ({isUsingWhitelist ? token.whitelistPrice : token.price} ETH)
                              </span>
                            </div>
                          </div>
                          
                          {isTokenWhitelisted && token.isWhitelistActive && (
                            <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/20">
                              WL: {whitelistAllocation}
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3 space-y-2">
                        {isTokenWhitelisted && token.isWhitelistActive && (
                          <div className="flex items-center justify-between text-xs bg-slate-700/50 rounded p-2">
                            <span className="text-slate-300">Use whitelist price?</span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWhitelistForToken(token.id);
                              }}
                              className={`relative inline-flex items-center h-5 rounded-full w-10 transition-colors ${
                                isUsingWhitelist ? 'bg-yellow-500' : 'bg-slate-600'
                              }`}
                            >
                              <span
                                className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                                  isUsingWhitelist ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Quantity:</span>
                          <div className="flex items-center bg-slate-700 rounded overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const current = selectedTokens.find(item => item.tokenId === token.id)?.amount || 1;
                                updateAmount(token.id, current - 1);
                              }}
                              className="bg-slate-700 hover:bg-slate-600 w-8 h-8 flex items-center justify-center transition-colors"
                              disabled={selectedTokens.find(item => item.tokenId === token.id)?.amount <= 1}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={isUsingWhitelist ? Math.min(parseInt(token.maxMintPerTx), whitelistAllocation) : token.maxMintPerTx}
                              value={selectedTokens.find(item => item.tokenId === token.id)?.amount || 1}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateAmount(token.id, parseInt(e.target.value));
                              }}
                              className="mx-1 w-12 bg-transparent border-none text-center text-sm focus:outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const current = selectedTokens.find(item => item.tokenId === token.id)?.amount || 1;
                                updateAmount(token.id, current + 1);
                              }}
                              className="bg-slate-700 hover:bg-slate-600 w-8 h-8 flex items-center justify-center transition-colors"
                              disabled={selectedTokens.find(item => item.tokenId === token.id)?.amount >= 
                                (isUsingWhitelist 
                                  ? Math.min(parseInt(token.maxMintPerTx), whitelistAllocation)
                                  : parseInt(token.maxMintPerTx))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">
                <span className="text-slate-400">Total Price:</span>
                <span className="ml-2 font-mono font-medium text-cyan-300">
                  {getTotalPrice()} ETH
                </span>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">Selected:</span>
                <span className="ml-2 font-mono font-medium text-cyan-300">
                  {selectedTokens.length} token{selectedTokens.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-md text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onBatchMint(selectedTokens)}
                disabled={selectedTokens.length === 0}
                className={`flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all ${
                  selectedTokens.length > 0
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-md hover:shadow-cyan-500/25 hover-glow"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
              >
                Mint Selected ({selectedTokens.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 