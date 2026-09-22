'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard, FeaturedEventCard } from '@/components/cards/EventCard';
import SearchFilters from '@/components/filters/SearchFilters';
import { getEventsByCategory, filterAndSortEvents } from '@/data/events';
import { artists } from '@/data/artists';
import { teams } from '@/data/teams';
import { venues } from '@/data/venues';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function CategoryTemplate({
  title,
  categoryKey,
  description,
  subcategories = [],
  heroImage = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
}) {
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [filters, setFilters] = useState({
    category: categoryKey,
    subcategory: 'all',
    cityId: 'all',
    priceMax: 1500,
    sortBy: 'recommended',
    isVIP: false,
    isResale: false,
    isAccessible: false,
  });

  const allCategoryEvents = getEventsByCategory(categoryKey);
  const featuredEvents = allCategoryEvents.filter((e) => e.isFeatured).slice(0, 2);

  const filteredEvents = filterAndSortEvents({
    category: categoryKey,
    subcategory: activeSubcategory !== 'all' ? activeSubcategory : filters.subcategory,
    cityId: filters.cityId,
    priceMax: filters.priceMax,
    isVIP: filters.isVIP,
    isResale: filters.isResale,
    isAccessible: filters.isAccessible,
    sortBy: filters.sortBy,
  });

  // Category specific matching artists/teams
  const categoryArtists = artists.filter((a) => a.category === categoryKey);
  const categoryTeams = teams.filter((t) => categoryKey === 'sports');
  const categoryVenues = venues.slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 md:pt-32 bg-transparent">
        {/* Category Hero */}
        <section className="relative py-16 md:py-24 border-b border-[var(--border)] overflow-hidden bg-transparent">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Image src={heroImage} alt={title} fill className="object-cover" unoptimized />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/90 to-transparent" />

          <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg)] mb-4">
                <Sparkles size={12} className="text-[var(--fg)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">Category</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight mb-3">{title}</h1>
              <p className="text-sm md:text-base text-[var(--fg-sec)] leading-relaxed mb-6">{description}</p>

              {/* Subcategories Pills */}
              {subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setActiveSubcategory('all'); setFilters((f) => ({ ...f, subcategory: 'all' })); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      activeSubcategory === 'all'
                        ? 'bg-[var(--fg)] text-[var(--bg)]'
                        : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--fg-sec)] hover:text-[var(--fg)]'
                    }`}
                  >
                    All {title}
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => { setActiveSubcategory(sub); setFilters((f) => ({ ...f, subcategory: sub })); }}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        activeSubcategory === sub
                          ? 'bg-[var(--fg)] text-[var(--bg)]'
                          : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--fg-sec)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        {featuredEvents.length > 0 && (
          <section className="py-12 border-b border-[var(--border)] bg-[var(--bg)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--fg-sec)] mb-6">Featured in {title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredEvents.map((event) => (
                  <FeaturedEventCard key={event.id} event={event} className="aspect-[16/9]" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Grid + Filter Sidebar */}
        <section className="py-12">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <SearchFilters
                filters={filters}
                onChange={setFilters}
                onReset={() => { setActiveSubcategory('all'); setFilters({ category: categoryKey, subcategory: 'all', cityId: 'all', priceMax: 1500, sortBy: 'recommended' }); }}
                totalResults={filteredEvents.length}
              />

              {/* Main Grid */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">
                    Showing {filteredEvents.length} Events
                  </p>
                </div>

                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredEvents.map((event, i) => (
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
                  <div className="py-16 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                    <p className="text-sm text-[var(--fg-sec)] font-semibold">No events found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Artists / Teams in this category */}
        {(categoryArtists.length > 0 || categoryTeams.length > 0) && (
          <section className="py-14 border-t border-[var(--border)] bg-[var(--bg-sec)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">Popular {categoryKey === 'sports' ? 'Teams' : 'Artists'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryKey === 'sports'
                  ? categoryTeams.map((team) => (
                      <Link
                        key={team.id}
                        href={`/team/${team.slug}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all"
                      >
                        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[var(--bg-sec)]">
                          <Image src={team.image} alt={team.name} fill className="object-cover group-hover:scale-108 transition-transform" unoptimized />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-[var(--fg)]">{team.name}</h3>
                          <p className="text-xs text-[var(--fg-sec)]">{team.league}</p>
                        </div>
                        <ArrowRight size={14} className="text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))
                  : categoryArtists.map((artist) => (
                      <Link
                        key={artist.id}
                        href={`/artist/${artist.slug}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all"
                      >
                        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[var(--bg-sec)]">
                          <Image src={artist.image} alt={artist.name} fill className="object-cover group-hover:scale-108 transition-transform" unoptimized />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-[var(--fg)]">{artist.name}</h3>
                          <p className="text-xs text-[var(--fg-sec)]">{artist.genre}</p>
                        </div>
                        <ArrowRight size={14} className="text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
              </div>
            </div>
          </section>
        )}

        {/* Venues in this category */}
        <section className="py-14 border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">Popular Venues</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryVenues.map((venue) => (
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
                    <p className="text-xs text-[var(--fg-sec)]">{venue.city}, {venue.state}</p>
                  </div>
                  <ArrowRight size={14} className="text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
