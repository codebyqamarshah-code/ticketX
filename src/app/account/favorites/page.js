'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFavorites } from '@/context/FavoritesContext';
import { getEvents } from '@/data/events';
import { EventCard } from '@/components/cards/EventCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const allEvents = getEvents();

  const favoriteEvents = allEvents.filter((e) => favorites.includes(e.id));

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)] pb-16">
        <section className="py-12">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-8">
            {/* Account Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">My Account</span>
                <h1 className="text-2xl md:text-4xl font-black text-[var(--fg)] tracking-tight">Favorites</h1>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { label: 'My Tickets', href: '/account/tickets' },
                  { label: 'Order History', href: '/account/orders' },
                  { label: 'Favorites', href: '/account/favorites', active: true },
                  { label: 'Watchlist', href: '/account/watchlist' },
                ].map((nav) => (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      nav.active
                        ? 'bg-[var(--fg)] text-[var(--bg)]'
                        : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] border border-[var(--border)]'
                    }`}
                  >
                    {nav.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Grid */}
            {favoriteEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favoriteEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 max-w-md mx-auto space-y-3">
                <Heart size={40} className="mx-auto text-[var(--fg-sec)] opacity-30" />
                <h3 className="text-base font-bold text-[var(--fg)]">No favorites saved</h3>
                <p className="text-xs text-[var(--fg-sec)]">Click the heart icon on any event to save it to your favorites.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
