'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const WatchlistContext = createContext();

function getInitialWatchlist() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('ticketx-watchlist');
  if (saved) try { return JSON.parse(saved); } catch (_) {}
  return [];
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setWatchlist(getInitialWatchlist()); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const toggleWatchlist = (itemId) => {
    setWatchlist((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      localStorage.setItem('ticketx-watchlist', JSON.stringify(next));
      return next;
    });
  };

  const isWatchlisted = (itemId) => watchlist.includes(itemId);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, isWatchlisted }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
