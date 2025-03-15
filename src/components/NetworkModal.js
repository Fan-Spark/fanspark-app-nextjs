import { useState, useEffect } from 'react';
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK, getNetworkById } from '@/utils/networkConfig';

export default function NetworkModal({ currentChainId, onClose, onSwitchNetwork }) {
  const [selectedNetwork, setSelectedNetwork] = useState(DEFAULT_NETWORK.id);

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
  };

  const handleSwitchNetwork = () => {
    onSwitchNetwork(selectedNetwork);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-400">Network Change Required</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              This application runs on Base, a secure and low-cost Ethereum Layer 2 network.
              Please switch to Base to mint your RewardCrate tokens.
            </p>
            
            <div className="p-3 bg-indigo-900/30 rounded mb-4">
              <p className="text-sm text-indigo-300 mb-2">
                <span className="font-bold">💡 Tip:</span> If you don't see Base in your wallet, you may need to add it manually.
              </p>
              <a 
                href="https://docs.base.org/using-base" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:underline"
              >
                Learn how to add Base to your wallet →
              </a>
            </div>
            
            <select 
              value={selectedNetwork} 
              onChange={handleNetworkChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4 text-white cursor-pointer hover:border-cyan-500/50 transition-colors"
            >
              {Object.values(SUPPORTED_NETWORKS).map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name} ({network.token})
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleSwitchNetwork}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold rounded-lg transition-all hover-glow"
          >
            Switch to {getNetworkById(selectedNetwork)?.name || 'Selected Network'}
          </button>
        </div>
      </div>
    </div>
  );
} 