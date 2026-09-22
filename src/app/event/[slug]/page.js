'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard } from '@/components/cards/EventCard';
import FavoriteButton from '@/components/ui/FavoriteButton';
import WatchlistButton from '@/components/ui/WatchlistButton';
import { getEventBySlug, getRelatedEvents } from '@/data/events';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar, MapPin, Clock, Share2, ShieldCheck, Ticket, Accessibility, Info, ChevronRight, Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const event = getEventBySlug(slug) || {
    id: 'e-default',
    slug: slug || 'event',
    title: slug ? slug.replace('-', ' ').toUpperCase() : 'Event Title',
    category: 'concerts',
    subcategory: 'Live Show',
    artist: 'Featured Artist',
    artistSlug: 'taylor-swift',
    description: 'Experience an extraordinary live event with world-class production, incredible acoustics, and memories that last a lifetime.',
    date: '2026-10-15',
    time: '7:30 PM',
    venue: 'SoFi Stadium',
    venueSlug: 'sofi-stadium',
    city: 'Los Angeles',
    country: 'USA',
    priceFrom: 75,
    priceTo: 450,
    availability: 'available',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
    isVIP: true,
    isAccessible: true,
  };

  const relatedEvents = getRelatedEvents(event);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 md:pt-32 lg:pt-36 bg-transparent pb-24 lg:pb-16">
        {/* Event Hero */}
        <section className="relative py-12 md:py-20 border-b border-[var(--border)] overflow-hidden bg-[var(--bg-sec)]">
          <div className="absolute inset-0 opacity-85 pointer-events-none">
            <Image src={event.image} alt={event.title} fill className="object-cover object-center" unoptimized />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent md:bg-gradient-to-r" />

          <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 items-end">
              {/* Left Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-3 py-1 rounded-full">
                    {event.subcategory || event.category}
                  </span>
                  {event.isVIP && (
                    <span className="text-xs font-bold uppercase tracking-widest bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] px-3 py-1 rounded-full">
                      VIP Packages Available
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
                  {event.title}
                </h1>

                {/* Event Metadata Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center gap-3">
                    <Calendar size={18} className="text-[var(--fg)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Date & Time</p>
                      <p className="text-xs font-bold text-[var(--fg)] truncate">{event.date} · {event.time}</p>
                    </div>
                  </div>

                  <Link
                    href={`/venue/${event.venueSlug || 'sofi-stadium'}`}
                    className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-colors flex items-center gap-3 group"
                  >
                    <MapPin size={18} className="text-[var(--fg)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Venue</p>
                      <p className="text-xs font-bold text-[var(--fg)] truncate group-hover:underline">{event.venue}</p>
                    </div>
                  </Link>

                  <Link
                    href={`/cities/${event.cityId || 'los-angeles'}`}
                    className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-colors flex items-center gap-3 group"
                  >
                    <MapPin size={18} className="text-[var(--fg)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Location</p>
                      <p className="text-xs font-bold text-[var(--fg)] truncate group-hover:underline">{event.city}, {event.country}</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Action Box */}
              <div className="flex items-center justify-between lg:justify-end gap-3 pt-4 border-t border-[var(--border)] lg:border-t-0">
                <div className="flex items-center gap-2">
                  <FavoriteButton eventId={event.id} />
                  <WatchlistButton eventId={event.id} />
                  <button
                    onClick={handleShare}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all text-[var(--fg-sec)] hover:text-[var(--fg)]"
                    aria-label="Share event link"
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-12">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column — Detailed Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Event Description */}
                <div className="p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">
                  <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight">About This Event</h2>
                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{event.description}</p>
                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed">
                    Don&apos;t miss your chance to experience {event.title} live at {event.venue}. Select your seats today for guaranteed official tickets through TicketX.
                  </p>
                </div>

                {/* Venue & Location Details */}
                <div className="p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight">Venue Information</h2>
                    <Link
                      href={`/venue/${event.venueSlug || 'sofi-stadium'}`}
                      className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-sec)] hover:text-[var(--fg)] flex items-center gap-1"
                    >
                      Venue Profile <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] space-y-1">
                      <p className="text-xs font-bold text-[var(--fg)]">{event.venue}</p>
                      <p className="text-xs text-[var(--fg-sec)]">{event.city}, {event.country}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] space-y-1">
                      <p className="text-xs font-bold text-[var(--fg)]">Doors Open</p>
                      <p className="text-xs text-[var(--fg-sec)]">60 minutes before showtime</p>
                    </div>
                  </div>
                </div>

                {/* Policies & Accessibility */}
                <div className="p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">
                  <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight">Entry & Policies</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--fg-sec)]">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                      <ShieldCheck size={18} className="text-[var(--fg)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[var(--fg)] mb-0.5">100% Buyer Guarantee</p>
                        <p className="leading-relaxed">All tickets are 100% verified and guaranteed valid for entry.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                      <Accessibility size={18} className="text-[var(--fg)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[var(--fg)] mb-0.5">ADA Accessible</p>
                        <p className="leading-relaxed">Wheelchair accessible seating and companion tickets available.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column — Desktop Ticket Purchase Panel */}
              <div className="hidden lg:block sticky top-24 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/5 space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-sec)]">Ticket Pricing</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-[var(--fg)]">${event.priceFrom}</span>
                    <span className="text-xs text-[var(--fg-sec)]">to ${event.priceTo}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between text-xs text-[var(--fg-sec)]">
                    <span>Availability</span>
                    <span className="font-bold text-[var(--fg)] uppercase">{event.availability}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--fg-sec)]">
                    <span>Ticket Types</span>
                    <span className="font-bold text-[var(--fg)]">Standard / VIP</span>
                  </div>
                </div>

                <Link
                  href={`/event/${event.slug}/tickets`}
                  className="block w-full py-4 bg-[var(--fg)] text-[var(--bg)] text-sm font-black uppercase tracking-wider rounded-xl text-center hover:opacity-90 active:scale-95 transition-all shadow-lg"
                >
                  FIND TICKETS
                </Link>

                <p className="text-[11px] text-center text-[var(--fg-sec)]">
                  Prices are set by sellers and may be above or below face value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="py-14 border-t border-[var(--border)] bg-[var(--bg-sec)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedEvents.map((rel) => (
                  <EventCard key={rel.id} event={rel} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mobile Sticky Bottom CTA Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md flex items-center justify-between gap-4 shadow-2xl">
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Starting at</p>
            <p className="text-xl font-black text-[var(--fg)]">${event.priceFrom}</p>
          </div>
          <Link
            href={`/event/${event.slug}/tickets`}
            className="flex-1 py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl text-center hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            FIND TICKETS
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
