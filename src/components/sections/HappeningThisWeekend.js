'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { EventCard } from '@/components/cards/EventCard';
import { getWeekendEvents } from '@/data/events';
import { CalendarDays } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'concerts', label: 'Concerts' },
  { id: 'sports', label: 'Sports' },
  { id: 'arts-theater', label: 'Theater' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'family', label: 'Family' },
];

export default function HappeningThisWeekend() {
  const [activeTab, setActiveTab] = useState('all');
  const events = getWeekendEvents(activeTab);

  return (
    <section className="py-14 bg-[var(--bg-sec)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          title="Happening This Weekend"
          href="/events"
          icon={CalendarDays}
        />

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] ${
                activeTab === tab.id
                  ? 'bg-[var(--fg)] text-[var(--bg)]'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--fg-sec)] hover:text-[var(--fg)] hover:border-[var(--fg-sec)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {events.length > 0 ? (
              events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-[var(--fg-sec)] text-sm">No events found in this category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
