'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search, Heart, Bookmark, User, Menu, X, ArrowRight, Tag, LogOut, Ticket, ShoppingBag, Settings, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LocationSelector from '@/components/ui/LocationSelector';
import Logo from '@/components/ui/Logo';
import { searchEvents } from '@/data/events';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Concerts', href: '/concerts' },
  { label: 'Sports', href: '/sports' },
  { label: 'Arts & Theater', href: '/arts-theater' },
  { label: 'Comedy', href: '/comedy' },
  { label: 'Family', href: '/family' },
  { label: 'Cities', href: '/cities' },
];

function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      setResults(searchEvents(val).slice(0, 6));
    } else {
      setResults([]);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search events"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="bg-[var(--bg)] border-b border-[var(--border)] px-4 md:px-8 py-5"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-[var(--fg-sec)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKey}
              placeholder="Search events, artists, venues, cities..."
              className="flex-1 text-base bg-transparent text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none font-medium"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); }}
                className="p-1 rounded-full hover:bg-[var(--bg-sec)]"
                aria-label="Clear search query"
              >
                <X size={16} className="text-[var(--fg-sec)] hover:text-[var(--fg)]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-2 text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] px-2.5 py-1 rounded-lg hover:bg-[var(--bg-sec)]"
            >
              Cancel
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div
              className="mt-4 space-y-1 max-h-[60vh] overflow-y-auto overflow-x-hidden pr-1.5 custom-dropdown-scroll"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--fg-sec) var(--bg-sec)',
              }}
            >
              {results.map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-sec)] transition-colors group"
                >
                  <Search size={14} className="text-[var(--fg-sec)] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--fg)] line-clamp-1">{event.title}</p>
                    <p className="text-xs text-[var(--fg-sec)]">{event.venue} · {event.city}</p>
                  </div>
                  <ArrowRight size={14} className="text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-[var(--fg)] hover:bg-[var(--bg-sec)] rounded-xl transition-colors mt-2 border-t border-[var(--border)] pt-3"
              >
                <span>See all results for &quot;{query}&quot;</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Popular searches when empty */}
          {!query && (
            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <p className="text-[10px] uppercase tracking-widest text-[var(--fg-sec)] font-bold mb-2.5">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Taylor Swift', 'NBA', 'WWE', 'Hamilton', 'Drake', 'Coachella'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); setResults(searchEvents(s).slice(0, 6)); }}
                    className="text-xs font-semibold px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] hover:border-[var(--fg-sec)] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MobileMenu({ onClose }) {
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.28 }}
      className="fixed inset-0 z-[90] bg-[var(--bg)] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <Logo onClick={onClose} width={140} height={38} />
        <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-sec)] transition-colors" aria-label="Close menu">
          <X size={20} className="text-[var(--fg)]" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
        {NAV_LINKS.map((link, i) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
          >
            <Link
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between py-3.5 text-base font-bold text-[var(--fg)] border-b border-[var(--border)] hover:text-[var(--fg-sec)] transition-colors"
            >
              {link.label}
              <ArrowRight size={16} className="text-[var(--fg-sec)]" />
            </Link>
          </motion.div>
        ))}

        <div className="pt-3 space-y-1">
          <Link href="/sell" onClick={onClose} className="flex items-center justify-between py-3 text-xs font-semibold text-[var(--fg-sec)]">
            Sell Tickets
          </Link>
        </div>
      </nav>

      {/* Footer actions */}
      <div className="px-5 py-5 border-t border-[var(--border)] space-y-3">
        {isAuthenticated ? (
          <div className="space-y-2">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-sm font-bold text-[var(--fg)]"
            >
              <User size={16} />
              <span>My Account ({user?.firstName})</span>
            </Link>
            <button
              onClick={() => { signOut(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-500 text-xs font-bold"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <div>
            <Link
              href="/signin"
              onClick={onClose}
              className="block w-full py-3 text-center rounded-full bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider"
            >
              Login
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <ThemeToggle className="flex-1 justify-center" />
          <LocationSelector className="flex-1" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const userMenuRef = useRef(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Click outside listener for user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm shadow-black/5'
            : 'py-2.5 md:py-3 bg-[var(--bg)] border-b border-[var(--border)]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* LEFT: Logo + Nav links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Logo width={145} height={38} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:bg-[var(--bg-sec)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] ${
                    pathname === link.href
                      ? 'text-[var(--fg)] bg-[var(--bg-sec)]'
                      : 'text-[var(--fg-sec)] hover:text-[var(--fg)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: Utility actions & Auth buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sell Tickets link */}
            <Link
              href="/sell"
              className="hidden xl:inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors px-2 py-1"
            >
              Sell Tickets
            </Link>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-8.5 h-8.5 rounded-full text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)]"
              aria-label="Search events"
            >
              <Search size={17} />
            </button>

            {/* Location selector */}
            <div className="hidden md:block">
              <LocationSelector />
            </div>

            {/* Favorites */}
            <Link
              href="/account/favorites"
              className="hidden md:flex items-center justify-center w-8.5 h-8.5 rounded-full hover:bg-[var(--bg-sec)] transition-colors text-[var(--fg-sec)] hover:text-[var(--fg)]"
              aria-label="Favorites"
            >
              <Heart size={17} />
            </Link>

            {/* Watchlist */}
            <Link
              href="/account/watchlist"
              className="hidden md:flex items-center justify-center w-8.5 h-8.5 rounded-full hover:bg-[var(--bg-sec)] transition-colors text-[var(--fg-sec)] hover:text-[var(--fg)]"
              aria-label="Watchlist"
            >
              <Bookmark size={17} />
            </Link>

            {/* Theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-[var(--border)] mx-0.5" />

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] hover:border-[var(--fg-sec)] transition-all"
                >
                  <div className="w-6.5 h-6.5 rounded-full overflow-hidden relative border border-[var(--border)] bg-[var(--fg)] shrink-0 flex items-center justify-center text-[var(--bg)]">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt="User Avatar" fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-[11px] font-black uppercase leading-none">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[var(--fg)] max-w-[90px] truncate">
                    {user?.firstName || 'Account'}
                  </span>
                  <ChevronDown size={12} className="text-[var(--fg-sec)]" />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-2xl space-y-1 z-50"
                    >
                      <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                        <p className="text-xs font-bold text-[var(--fg)]">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[10px] text-[var(--fg-sec)] truncate">{user?.email}</p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-sec)]"
                      >
                        <User size={15} /> Overview
                      </Link>

                      <Link
                        href="/account/tickets"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-sec)]"
                      >
                        <Ticket size={15} /> My Tickets
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-sec)]"
                      >
                        <ShoppingBag size={15} /> Order History
                      </Link>

                      <Link
                        href="/account/resale"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-sec)]"
                      >
                        <Tag size={15} /> Resale Listings
                      </Link>

                      <Link
                        href="/account/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-sec)]"
                      >
                        <Settings size={15} /> Settings
                      </Link>

                      <div className="pt-1 border-t border-[var(--border)] mt-1">
                        <button
                          onClick={() => {
                            signOut();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/signin"
                className="hidden md:inline-flex items-center px-4 py-2 text-[11px] font-black uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] rounded-full hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm"
              >
                Login
              </Link>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center w-8.5 h-8.5 rounded-full hover:bg-[var(--bg-sec)] transition-colors text-[var(--fg)]"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
