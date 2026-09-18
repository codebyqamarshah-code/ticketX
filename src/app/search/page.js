'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard, CityCard } from '@/components/cards/EventCard';
import SearchFilters from '@/components/filters/SearchFilters';
import { searchAll, filterAndSortEvents } from '@/data/events';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Music, Trophy, Building2, User, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialCity = searchParams.get('city') || 'all';
  const initialPriceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : 1500;
  const initialSortBy = searchParams.get('sortBy') || 'recommended';

  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    category: initialCategory,
    cityId: initialCity,
    priceMax: initialPriceMax,
    sortBy: initialSortBy,
    isVIP: false,
    isResale: false,
    isAccessible: false,
  });

  // Perform search across all entities
  const allResults = searchAll(query);
  const filteredEvents = filterAndSortEvents({
    query,
    category: filters.category,
    cityId: filters.cityId,
    priceMax: filters.priceMax,
    isVIP: filters.isVIP,
    isResale: filters.isResale,
    isAccessible: filters.isAccessible,
    sortBy: filters.sortBy,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      cityId: 'all',
      priceMax: 1500,
      sortBy: 'recommended',
      isVIP: false,
      isResale: false,
      isAccessible: false,
    });
  };

  const tabs = [
    { id: 'all', label: 'All Results', count: filteredEvents.length + allResults.artists.length + allResults.teams.length + allResults.venues.length },
    { id: 'events', label: 'Events', count: filteredEvents.length },
    { id: 'artists', label: 'Artists', count: allResults.artists.length },
    { id: 'teams', label: 'Teams', count: allResults.teams.length },
    { id: 'venues', label: 'Venues', count: allResults.venues.length },
    { id: 'cities', label: 'Cities', count: allResults.cities.length },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      {/* Search Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] mb-3">
          <Search size={12} className="text-[var(--fg-sec)]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-sec)]">
            Search Results
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-[var(--fg)] tracking-tight">
          {query ? `Results for "${query}"` : 'Discover Live Events'}
        </h1>
        <p className="text-sm text-[var(--fg-sec)] mt-1">
          Found {filteredEvents.length} events matching your criteria
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-8 border-b border-[var(--border)]" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)]'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        {(activeTab === 'all' || activeTab === 'events') && (
          <SearchFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            totalResults={filteredEvents.length}
          />
        )}

        {/* Results Column */}
        <div className="flex-1 min-w-0">
          {/* TAB: ALL or EVENTS */}
          {(activeTab === 'all' || activeTab === 'events') && (
            <div className="space-y-8">
              {filteredEvents.length > 0 ? (
                <div>
                  {activeTab === 'all' && (
                    <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] mb-4">Events ({filteredEvents.length})</h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredEvents.map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
                  <Search size={36} className="mx-auto mb-3 text-[var(--fg-sec)]" />
                  <h3 className="text-base font-bold text-[var(--fg)]">No events found</h3>
                  <p className="text-xs text-[var(--fg-sec)] mt-1">Try adjusting your filters or search query.</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: ARTISTS */}
          {(activeTab === 'all' || activeTab === 'artists') && allResults.artists.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
              <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] mb-4">Matching Artists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allResults.artists.map((artist) => (
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
          )}

          {/* TAB: TEAMS */}
          {(activeTab === 'all' || activeTab === 'teams') && allResults.teams.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
              <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] mb-4">Matching Teams</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allResults.teams.map((team) => (
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
                      <p className="text-xs text-[var(--fg-sec)]">{team.league} · {team.sport}</p>
                    </div>
                    <ArrowRight size={14} className="text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TAB: VENUES */}
          {(activeTab === 'all' || activeTab === 'venues') && allResults.venues.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
              <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] mb-4">Matching Venues</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allResults.venues.map((venue) => (
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
          )}

          {/* TAB: CITIES */}
          {(activeTab === 'all' || activeTab === 'cities') && allResults.cities.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
              <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] mb-4">Matching Cities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {allResults.cities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)]">
        <Suspense fallback={<div className="p-16 text-center text-sm text-[var(--fg-sec)]">Loading search...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
