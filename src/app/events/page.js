'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard } from '@/components/cards/EventCard';
import { events as allEvents } from '@/data/events';
import { CalendarDays, Filter, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Events' },
  { id: 'concerts', label: 'Concerts' },
  { id: 'sports', label: 'Sports' },
  { id: 'arts-theater', label: 'Theater & Arts' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'family', label: 'Family' },
];

const TIMEFRAME_TABS = [
  { id: 'all', label: 'All Dates' },
  { id: 'weekend', label: 'This Weekend' },
  { id: 'month', label: 'This Month' },
];

export default function UpcomingEventsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTimeframe, setActiveTimeframe] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = allEvents.filter((event) => {
    // Category Filter
    if (activeCategory !== 'all' && event.category !== activeCategory) {
      return false;
    }
    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = event.title?.toLowerCase().includes(q);
      const matchVenue = event.venue?.toLowerCase().includes(q);
      const matchCity = event.city?.toLowerCase().includes(q);
      const matchArtist = event.artist?.toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchCity && !matchArtist) return false;
    }
    // Timeframe Filter
    if (activeTimeframe === 'weekend') {
      return event.isWeekend || event.isTrending;
    }
    return true;
  });

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto py-10 md:py-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <CalendarDays size={14} className="text-[var(--fg)]" />
              <span>Upcoming Live Events</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
              Explore All Upcoming Events
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)]">
              Discover concerts, sports games, and theater productions with 100% verified tickets.
            </p>

            {/* Search Input */}
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by artist, team, venue, or city..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)] shadow-sm transition-colors"
              />
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border)]">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-[var(--fg)] text-[var(--bg)] shadow-md'
                      : 'bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg-sec)] hover:text-[var(--fg)] hover:border-[var(--fg-sec)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
              <Filter size={14} className="text-[var(--fg-sec)] mr-1" />
              {TIMEFRAME_TABS.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setActiveTimeframe(tf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTimeframe === tf.id
                      ? 'bg-[var(--card)] border border-[var(--fg-sec)] text-[var(--fg)]'
                      : 'text-[var(--fg-sec)] hover:text-[var(--fg)]'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events Count Indicator */}
          <div className="mb-6 flex items-center justify-between text-xs text-[var(--fg-sec)]">
            <span>Showing <strong>{filteredEvents.length}</strong> upcoming events</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="underline hover:text-[var(--fg)]">
                Clear Search
              </button>
            )}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)]">
                <CalendarDays size={40} className="mx-auto mb-3 text-[var(--fg-sec)] opacity-60" />
                <h3 className="text-lg font-bold text-[var(--fg)]">No events found matching your criteria</h3>
                <p className="text-sm text-[var(--fg-sec)] mt-1">Try switching category tabs or clearing your search term.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
