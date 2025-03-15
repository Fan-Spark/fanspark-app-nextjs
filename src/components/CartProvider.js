'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  const addToCart = (tokenId, quantity, isWhitelist, price, whitelistPrice) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.tokenId === tokenId);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.tokenId === tokenId
            ? { ...item, quantity, price, whitelistPrice }
            : item
        );
      }
      
      return [...prevCart, { 
        tokenId, 
        quantity, 
        isWhitelist,
        price,
        whitelistPrice
      }];
    });
  };
  
  const removeFromCart = (tokenId) => {
    setCart(prevCart => prevCart.filter(item => item.tokenId !== tokenId));
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