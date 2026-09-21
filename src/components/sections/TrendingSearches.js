'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { TrendingCard } from '@/components/cards/EventCard';
import { trendingSearches } from '@/data/categories';

export default function TrendingSearches() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  const scrollButtons = (
    <div className="flex items-center gap-1.5 ml-2">
      <button
        onClick={() => scroll(-1)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--bg-sec)] transition-colors text-[var(--fg-sec)] hover:text-[var(--fg)] focus:outline-none"
        aria-label="Scroll left"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--bg-sec)] transition-colors text-[var(--fg-sec)] hover:text-[var(--fg)] focus:outline-none"
        aria-label="Scroll right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );

  return (
    <section className="py-10 bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          title="Trending Searches"
          subtitle="What fans are booking right now"
          href="/search"
          icon={TrendingUp}
          rightAction={scrollButtons}
        />

        {/* Horizontal scroll row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingSearches.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="shrink-0 snap-start"
              style={{ width: '140px' }}
            >
              <TrendingCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
