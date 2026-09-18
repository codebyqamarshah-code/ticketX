'use client';

import React, { createContext, useContext, useState } from 'react';
import { calculateOrderTotal } from '@/lib/pricing';

const CartContext = createContext();

function getInitialCart() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('ticketx-cart');
  if (saved) try { return JSON.parse(saved); } catch (_) {}
  return [];
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getInitialCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToCart = (ticketItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === ticketItem.id);
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
      } else {
        updated = [...prev, { ...ticketItem, quantity: ticketItem.quantity || 1 }];
      }
      localStorage.setItem('ticketx-cart', JSON.stringify(updated));
      return updated;
    });
    setDrawerOpen(true);
  };

  const removeFromCart = (ticketId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== ticketId);
      localStorage.setItem('ticketx-cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (ticketId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(ticketId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) => (item.id === ticketId ? { ...item, quantity } : item));
      localStorage.setItem('ticketx-cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ticketx-cart');
  };

  const pricing = calculateOrderTotal(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        pricing,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
