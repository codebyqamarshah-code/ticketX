'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import SectionHeader from '@/components/ui/SectionHeader';
import LocationSelector from '@/components/ui/LocationSelector';
import { EventCard } from '@/components/cards/EventCard';
import { getEventsByCity, getPopularEvents } from '@/data/events';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'concerts', label: 'Concerts' },
  { id: 'sports', label: 'Sports' },
  { id: 'arts-theater', label: 'Arts & Theater' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'family', label: 'Family' },
];

export default function PopularNearYou() {
  const { location } = useLocation();
  const [activeTab, setActiveTab] = useState('all');

  // Get events for the current city; fallback to popular events
  const cityEvents = getEventsByCity(location.cityId);
  const events = (cityEvents.length > 0 ? cityEvents : getPopularEvents())
    .filter((e) => activeTab === 'all' || e.category === activeTab)
    .slice(0, 4);

  return (
    <section className="py-14 bg-[var(--bg)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <SectionHeader
              title="Popular Near You"
              href={`/cities/${location.cityId}`}
              icon={MapPin}
            />
            <div className="flex items-center gap-2 -mt-2 mb-2">
              <p className="text-sm text-[var(--fg-sec)]">
                Showing events near <span className="font-semibold text-[var(--fg)]">{location.city}{location.country ? `, ${location.country}` : ''}</span>
              </p>
              <LocationSelector />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] ${
                activeTab === tab.id
                  ? 'bg-[var(--fg)] text-[var(--bg)]'
                  : 'bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg-sec)] hover:text-[var(--fg)] hover:border-[var(--fg-sec)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + location.cityId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {events.length > 0 ? (
              events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <MapPin size={32} className="mx-auto mb-3 text-[var(--fg-sec)]" />
                <p className="text-[var(--fg-sec)] text-sm">No events found near {location.city}.</p>
                <p className="text-[var(--fg-sec)] text-xs mt-1">Try changing your location above.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
