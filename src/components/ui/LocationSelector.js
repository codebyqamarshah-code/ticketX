'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, Search, Navigation, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationSelector({ variant = 'header', className = '' }) {
  const { location, locationStatus, requestGeolocation, selectCity, popularCities } = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const filtered = query
    ? popularCities.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : popularCities;

  const handleSelectCity = (city) => {
    selectCity(city);
    setOpen(false);
    setQuery('');
  };

  const handleGeo = () => {
    requestGeolocation();
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] rounded px-1"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MapPin size={14} className="shrink-0" />
        <span className="hidden sm:inline font-medium max-w-[120px] truncate">
          {location.city}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/20 z-50 overflow-hidden"
            role="listbox"
            aria-label="Select a city"
          >
            {/* Search */}
            <div className="p-3 border-b border-[var(--border)]">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cities..."
                  className="w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)] transition-colors"
                  autoFocus
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X size={12} className="text-[var(--fg-sec)] hover:text-[var(--fg)]" />
                  </button>
                )}
              </div>
            </div>

            {/* Detect location */}
            <button
              onClick={handleGeo}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--bg-sec)] transition-colors border-b border-[var(--border)] text-[var(--fg)]"
            >
              <Navigation size={14} className="text-[var(--fg-sec)]" />
              <span>{locationStatus === 'loading' ? 'Detecting...' : 'Use my current location'}</span>
            </button>

            {/* Cities list */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[var(--fg-sec)]">No cities found</p>
              ) : (
                filtered.map((city) => (
                  <button
                    key={city.id}
                    role="option"
                    aria-selected={location.cityId === city.id}
                    onClick={() => handleSelectCity(city)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-sec)] transition-colors text-left ${location.cityId === city.id ? 'text-[var(--fg)] font-semibold' : 'text-[var(--fg-sec)]'}`}
                  >
                    <MapPin size={12} className="shrink-0 text-[var(--fg-sec)]" />
                    <span>{city.name}</span>
                    <span className="ml-auto text-xs text-[var(--fg-sec)]">{city.country}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
