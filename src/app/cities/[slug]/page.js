'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard, CityCard } from '@/components/cards/EventCard';
import LocationSelector from '@/components/ui/LocationSelector';
import { popularCities } from '@/data/categories';
import { getEventsByCity, getPopularEvents } from '@/data/events';
import { venues } from '@/data/venues';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Events' },
  { id: 'concerts', label: 'Concerts' },
  { id: 'sports', label: 'Sports' },
  { id: 'arts-theater', label: 'Arts & Theater' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'family', label: 'Family' },
];

export default function CityDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const cityObj = popularCities.find((c) => c.id === slug) || {
    id: slug,
    name: slug ? slug.replace('-', ' ').toUpperCase() : 'City',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&q=80',
  };

  const [activeTab, setActiveTab] = useState('all');

  const rawCityEvents = getEventsByCity(cityObj.id);
  const cityEvents = (rawCityEvents.length > 0 ? rawCityEvents : getPopularEvents())
    .filter((e) => activeTab === 'all' || e.category === activeTab);

  const cityVenues = venues.filter((v) => v.cityId === cityObj.id || v.city.toLowerCase() === cityObj.name.toLowerCase());
  const otherCities = popularCities.filter((c) => c.id !== cityObj.id).slice(0, 5);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 md:pt-32 bg-transparent">
        {/* City Hero */}
        <section className="relative py-16 md:py-24 border-b border-[var(--border)] overflow-hidden bg-[var(--bg-sec)]">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image src={cityObj.image} alt={cityObj.name} fill className="object-cover" unoptimized />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/90 to-transparent" />

          <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg)] mb-4">
                <MapPin size={12} className="text-[var(--fg)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">City Guide</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight mb-3">
                Live Events in {cityObj.name}
              </h1>
              <p className="text-sm md:text-base text-[var(--fg-sec)] leading-relaxed mb-6">
                Discover concerts, sports games, Broadway shows, and entertainment happening in {cityObj.name}, {cityObj.country}.
              </p>
              <div className="flex items-center gap-3">
                <LocationSelector />
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs + Event Grid */}
        <section className="py-12">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto pb-2 mb-8 border-b border-[var(--border)]" style={{ scrollbarWidth: 'none' }}>
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[var(--fg)] text-[var(--bg)]'
                      : 'text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {cityEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cityEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
                <MapPin size={32} className="mx-auto mb-3 text-[var(--fg-sec)]" />
                <h3 className="text-sm font-bold text-[var(--fg)]">No events found in {cityObj.name} for this category.</h3>
              </div>
            )}
          </div>
        </section>

        {/* Venues in City */}
        {cityVenues.length > 0 && (
          <section className="py-14 border-t border-[var(--border)] bg-[var(--bg-sec)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">Popular Venues in {cityObj.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cityVenues.map((venue) => (
                  <Link
                    key={venue.id}
                    href={`/venue/${venue.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--fg)]">
                      <Building2 size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[var(--fg)]">{venue.name}</h3>
                      <p className="text-xs text-[var(--fg-sec)]">{venue.address}</p>
                    </div>
                    <ArrowRight size={14} className="text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other Cities */}
        <section className="py-14 border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">Explore Other Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {otherCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
