'use client';

import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  const addToCart = (tokenId, quantity, isWhitelist, price, whitelistPrice, tokenName = null) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.tokenId === tokenId);
      
      if (existingItem) {
        // Update existing item
        const updatedCart = prevCart.map(item =>
          item.tokenId === tokenId
            ? { ...item, quantity, price, whitelistPrice }
            : item
        );
        
        // Show update notification
        toast.success(`🛒 Updated ${tokenName || `Token #${tokenId}`} quantity to ${quantity}`);
        
        return updatedCart;
      }
      
      // Add new item
      const newCart = [...prevCart, { 
        tokenId, 
        quantity, 
        isWhitelist,
        price,
        whitelistPrice
      }];
      
      // Show add notification
      toast.success(`🎉 Added ${tokenName || `Token #${tokenId}`} to your cart!`);
      
      return newCart;
    });
  };
  
  const removeFromCart = (tokenId, tokenName = null, showNotification = true) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.tokenId !== tokenId);
      
      // Show remove notification only if requested
      if (showNotification) {
        toast.info(`🗑️ Removed ${tokenName || `Token #${tokenId}`} from your cart`);
      }
      
      return newCart;
    });
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const getCartQuantity = (tokenId) => {
    const item = cart.find(item => item.tokenId === tokenId);
    return item ? item.quantity : 0;
  };
  
  const isInCart = (tokenId) => {
    return cart.some(item => item.tokenId === tokenId);
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getCartQuantity,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext); 