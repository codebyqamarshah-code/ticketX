'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { EventCard } from '@/components/cards/EventCard';
import { getEventsByCategory } from '@/data/events';

export default function CategorySection({ category, title, href, icon: Icon }) {
  const scrollRef = useRef(null);
  const events = getEventsByCategory(category).slice(0, 6);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  if (events.length === 0) return null;

  return (
    <section className="py-14">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader title={title} href={href} icon={Icon} />
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => scroll(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--bg-sec)] transition-colors text-[var(--fg-sec)] hover:text-[var(--fg)]"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--bg-sec)] transition-colors text-[var(--fg-sec)] hover:text-[var(--fg)]"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll on mobile/tablet, grid on desktop */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="shrink-0 w-[280px] lg:w-auto"
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
