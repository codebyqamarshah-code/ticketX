'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard } from '@/components/cards/EventCard';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { getArtistBySlug, artists } from '@/data/artists';
import { getEventsByArtist, getPopularEvents } from '@/data/events';
import Image from 'next/image';
import Link from 'next/link';
import { User, Music, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArtistDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const artist = getArtistBySlug(slug) || {
    id: 'a-default',
    slug: slug || 'artist',
    name: slug ? slug.replace('-', ' ').toUpperCase() : 'Artist',
    genre: 'Live Music',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    headerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
    bio: 'Renowned live performer touring globally to sold-out arenas.',
    monthlyListeners: '50M+',
    hometown: 'Global Tour',
    activeYears: '2010 – Present',
  };

  const artistEvents = getEventsByArtist(artist.slug);
  const eventsToShow = artistEvents.length > 0 ? artistEvents : getPopularEvents().slice(0, 3);
  const otherArtists = artists.filter((a) => a.slug !== artist.slug).slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 md:pt-32 bg-[var(--bg)]">
        {/* Hero */}
        <section className="relative py-16 md:py-24 border-b border-[var(--border)] overflow-hidden bg-[var(--bg-sec)]">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <Image src={artist.headerImage || artist.image} alt={artist.name} fill className="object-cover" unoptimized />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/95 to-transparent" />

          <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--card)] shrink-0 shadow-xl">
                <Image src={artist.image} alt={artist.name} fill className="object-cover" unoptimized />
              </div>
              <div className="max-w-2xl flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-3 py-0.5 rounded-full">
                    {artist.genre}
                  </span>
                  <FavoriteButton eventId={`artist-${artist.id}`} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight mb-2">{artist.name}</h1>
                <p className="text-xs md:text-sm text-[var(--fg-sec)] leading-relaxed mb-4">{artist.bio}</p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--fg-sec)] pt-2 border-t border-[var(--border)]">
                  <div>
                    <span className="font-bold text-[var(--fg)]">{artist.monthlyListeners}</span> Monthly Listeners
                  </div>
                  <div>
                    Hometown: <span className="font-bold text-[var(--fg)]">{artist.hometown}</span>
                  </div>
                  <div>
                    Active: <span className="font-bold text-[var(--fg)]">{artist.activeYears}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Tour Dates & Events */}
        <section className="py-14">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[var(--fg)] tracking-tight mb-6">Upcoming Tour Dates & Events</h2>

            {eventsToShow.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {eventsToShow.map((event, i) => (
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
              <div className="py-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <p className="text-sm text-[var(--fg-sec)] font-semibold">No upcoming tour dates scheduled at this moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Similar Artists */}
        {otherArtists.length > 0 && (
          <section className="py-14 border-t border-[var(--border)] bg-[var(--bg-sec)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">Similar Artists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherArtists.map((a) => (
                  <Link
                    key={a.id}
                    href={`/artist/${a.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all"
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[var(--bg-sec)]">
                      <Image src={a.image} alt={a.name} fill className="object-cover group-hover:scale-108 transition-transform" unoptimized />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[var(--fg)]">{a.name}</h3>
                      <p className="text-xs text-[var(--fg-sec)]">{a.genre}</p>
                    </div>
                    <ArrowRight size={14} className="text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
