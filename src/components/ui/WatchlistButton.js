'use client';

import { useWatchlist } from '@/context/WatchlistContext';
import { Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WatchlistButton({ eventId, className = '' }) {
  const { toggleWatchlist, isWatchlisted } = useWatchlist();
  const active = isWatchlisted(eventId);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWatchlist(eventId); }}
      className={`group relative flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] ${className}`}
      aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active ? 'active' : 'inactive'}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Bookmark
            size={16}
            className={`transition-colors duration-200 ${active ? 'fill-current text-[var(--fg)] stroke-[var(--fg)]' : 'text-[var(--fg-sec)] group-hover:text-[var(--fg)]'}`}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
