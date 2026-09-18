'use client';

import { useState, useEffect } from 'react';
import { Filter, X, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { popularCities } from '@/data/categories';
import { categories } from '@/data/categories';

function FilterBody({ filters, onChange, onReset, activeFilterCount }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[var(--fg)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)]">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold bg-[var(--fg)] text-[var(--bg)] w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[var(--fg-sec)] hover:text-[var(--fg)] font-medium transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Sort By</label>
        <select
          value={filters.sortBy || 'recommended'}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)] transition-colors"
        >
          <option value="recommended">Recommended</option>
          <option value="date">Date (Soonest)</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Category</label>
        <select
          value={filters.category || 'all'}
          onChange={(e) => onChange({ ...filters, category: e.target.value, subcategory: 'all' })}
          className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)] transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Location / City</label>
        <select
          value={filters.cityId || 'all'}
          onChange={(e) => onChange({ ...filters, cityId: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)] transition-colors"
        >
          <option value="all">All Cities</option>
          {popularCities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
          ))}
        </select>
      </div>

      {/* Max Price Range Slider */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Max Price</label>
          <span className="text-sm font-bold text-[var(--fg)]">${filters.priceMax || 1500}</span>
        </div>
        <input
          type="range"
          min="20"
          max="1500"
          step="25"
          value={filters.priceMax || 1500}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full accent-[var(--fg)] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[var(--fg-sec)] font-semibold">
          <span>$20</span>
          <span>$750</span>
          <span>$1500+</span>
        </div>
      </div>

      {/* Ticket Types Checkboxes */}
      <div className="space-y-3 pt-2 border-t border-[var(--border)]">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Options</label>
        <div className="space-y-2">
          {[
            { id: 'isVIP', label: 'VIP Experiences' },
            { id: 'isResale', label: 'Resale Tickets' },
            { id: 'isAccessible', label: 'Accessible Seating' },
          ].map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 text-xs font-semibold text-[var(--fg)] cursor-pointer select-none group"
            >
              <div
                onClick={() => onChange({ ...filters, [opt.id]: !filters[opt.id] })}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters[opt.id]
                    ? 'bg-[var(--fg)] border-[var(--fg)] text-[var(--bg)]'
                    : 'border-[var(--border)] bg-[var(--bg-sec)] group-hover:border-[var(--fg-sec)]'
                }`}
              >
                {filters[opt.id] && <Check size={12} strokeWidth={3} />}
              </div>
              <span onClick={() => onChange({ ...filters, [opt.id]: !filters[opt.id] })}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchFilters({
  filters,
  onChange,
  onReset,
  totalResults,
  className = '',
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const activeFilterCount =
    (filters.category && filters.category !== 'all' ? 1 : 0) +
    (filters.cityId && filters.cityId !== 'all' ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.isVIP ? 1 : 0) +
    (filters.isResale ? 1 : 0) +
    (filters.isAccessible ? 1 : 0);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block w-64 shrink-0 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] h-fit ${className}`}>
        <FilterBody filters={filters} onChange={onChange} onReset={onReset} activeFilterCount={activeFilterCount} />
      </aside>

      {/* Mobile/Tablet Trigger Button */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-bold uppercase tracking-wider text-[var(--fg)] hover:border-[var(--fg-sec)] transition-all"
        >
          <Filter size={14} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        {totalResults !== undefined && (
          <span className="text-xs font-semibold text-[var(--fg-sec)]">{totalResults} Events</span>
        )}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex justify-end lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filter Options"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="w-full max-w-xs h-full bg-[var(--bg)] p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                  <h3 className="text-base font-bold uppercase tracking-wider text-[var(--fg)]">Filter Events</h3>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-[var(--bg-sec)]">
                    <X size={20} className="text-[var(--fg)]" />
                  </button>
                </div>
                <FilterBody filters={filters} onChange={onChange} onReset={onReset} activeFilterCount={activeFilterCount} />
              </div>

              <div className="pt-6 border-t border-[var(--border)] mt-6">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  Apply Filters ({totalResults || 0})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
