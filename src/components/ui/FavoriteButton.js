'use client';

import { useFavorites } from '@/context/FavoritesContext';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoriteButton({ eventId, className = '' }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const active = isFavorite(eventId);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(eventId); }}
      className={`group relative flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] ${className}`}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active ? 'active' : 'inactive'}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${
              active
                ? 'fill-[var(--fg)] text-[var(--fg)] stroke-[var(--fg)]'
                : 'text-[var(--fg-sec)] group-hover:text-[var(--fg)]'
            }`}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
