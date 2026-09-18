'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

function getInitialFavorites() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('ticketx-favorites');
  if (saved) try { return JSON.parse(saved); } catch (_) {}
  return [];
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getInitialFavorites()); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      localStorage.setItem('ticketx-favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
