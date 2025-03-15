'use client';

import CartButton from './CartButton';

export default function Header({ onDisconnect, onCartClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div>
            {/* Your logo or title */}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <CartButton onClick={onCartClick} />
            
            <button 
              onClick={onDisconnect}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 