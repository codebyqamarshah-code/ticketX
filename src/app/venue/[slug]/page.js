'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard } from '@/components/cards/EventCard';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { getVenueBySlug, venues } from '@/data/venues';
import { getEventsByVenue, getPopularEvents } from '@/data/events';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin, Users, Accessibility, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VenueDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const venue = getVenueBySlug(slug) || {
    id: 'v-default',
    slug: slug || 'venue',
    name: slug ? slug.replace('-', ' ').toUpperCase() : 'Venue',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    address: '1000 Main St, City, ST 90001',
    capacity: '50,000',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    headerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
    description: 'Premier sports and entertainment stadium hosting world-class concerts and athletic games.',
    accessibilityInfo: 'Fully ADA accessible with designated seating sections and elevator access.',
    parkingInfo: 'On-site parking structures available.',
    policies: ['No large bags', 'Cashless venue', 'No outside food'],
  };

  const venueEvents = getEventsByVenue(venue.slug);
  const eventsToShow = venueEvents.length > 0 ? venueEvents : getPopularEvents().slice(0, 4);
  const otherVenues = venues.filter((v) => v.slug !== venue.slug).slice(0, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)]">
        {/* Hero */}
        <section className="relative py-16 md:py-24 border-b border-[var(--border)] overflow-hidden bg-[var(--bg-sec)]">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image src={venue.headerImage || venue.image} alt={venue.name} fill className="object-cover" unoptimized />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/95 to-transparent" />

          <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-3 py-0.5 rounded-full">
                  Venue Profile
                </span>
                <FavoriteButton eventId={`venue-${venue.id}`} />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight mb-2">{venue.name}</h1>
              <div className="flex items-center gap-2 text-sm text-[var(--fg-sec)] mb-4">
                <MapPin size={14} />
                <span>{venue.address}</span>
              </div>
              <p className="text-xs md:text-sm text-[var(--fg-sec)] leading-relaxed mb-6">{venue.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--fg-sec)] pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[var(--fg)]" />
                  Capacity: <span className="font-bold text-[var(--fg)]">{venue.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-[var(--fg)]" />
                  City: <span className="font-bold text-[var(--fg)]">{venue.city}, {venue.state}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Venue Information & Policies */}
        <section className="py-12 border-b border-[var(--border)] bg-[var(--card)]">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-sec)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                  <Accessibility size={16} />
                  Accessibility
                </div>
                <p className="text-xs text-[var(--fg-sec)] leading-relaxed">{venue.accessibilityInfo}</p>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-sec)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                  <MapPin size={16} />
                  Parking & Transit
                </div>
                <p className="text-xs text-[var(--fg-sec)] leading-relaxed">{venue.parkingInfo}</p>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-sec)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                  <ShieldCheck size={16} />
                  Venue Policies
                </div>
                <ul className="text-xs text-[var(--fg-sec)] space-y-1 list-disc list-inside">
                  {venue.policies.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events at Venue */}
        <section className="py-14">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[var(--fg)] tracking-tight mb-6">Upcoming Events at {venue.name}</h2>

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
                <p className="text-sm text-[var(--fg-sec)] font-semibold">No upcoming events listed for this venue.</p>
              </div>
            )}
          </div>
        </section>

        {/* Other Venues */}
        {otherVenues.length > 0 && (
          <section className="py-14 border-t border-[var(--border)] bg-[var(--bg-sec)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">Explore Other Venues</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherVenues.map((v) => (
                  <Link
                    key={v.id}
                    href={`/venue/${v.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--fg)]">
                      <Building2 size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[var(--fg)]">{v.name}</h3>
                      <p className="text-xs text-[var(--fg-sec)]">{v.city}, {v.state}</p>
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
