'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Tag } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';
import WatchlistButton from '@/components/ui/WatchlistButton';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80';

const AVAILABILITY_STYLES = {
  available: { label: 'Available', classes: 'bg-[var(--fg)]/10 text-[var(--fg)] border-[var(--border)]' },
  limited: { label: 'Limited', classes: 'bg-[var(--bg-sec)] text-[var(--fg)] border-[var(--fg-sec)]/30' },
  'sold-out': { label: 'Sold Out', classes: 'bg-[var(--bg-sec)] text-[var(--fg-sec)] border-[var(--border)] opacity-60' },
};

function AvailabilityBadge({ availability }) {
  const config = AVAILABILITY_STYLES[availability] || AVAILABILITY_STYLES.available;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${config.classes}`}>
      {config.label}
    </span>
  );
}

// Default EventCard — used across sections
export function EventCard({ event, className = '' }) {
  const [imgSrc, setImgSrc] = useState(event.image || FALLBACK_IMAGE);

  return (
    <Link
      href={`/event/${event.slug}`}
      className={`group flex flex-col justify-between h-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/50 ${className}`}
    >
      {/* Top Image Container */}
      <div>
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--bg-sec)]">
          <Image
            src={imgSrc}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-108"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            unoptimized
          />
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
            {event.isVIP && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-2 py-0.5 rounded-md shadow-sm">
                VIP
              </span>
            )}
            {event.isResale && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--bg-sec)] text-[var(--fg)] border border-[var(--border)] px-2 py-0.5 rounded-md shadow-sm">
                Resale
              </span>
            )}
          </div>

          {/* Favorite + Watchlist overlay buttons */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <FavoriteButton eventId={event.id} />
            <WatchlistButton eventId={event.id} />
          </div>

          {/* Subcategory label */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 drop-shadow">
              {event.subcategory || event.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <h3 className="text-sm font-bold text-[var(--fg)] line-clamp-2 leading-snug group-hover:text-[var(--fg)] transition-colors min-h-[2.5rem]">
            {event.title}
          </h3>

          <div className="space-y-1 text-xs text-[var(--fg-sec)]">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0 text-[var(--fg-sec)]" />
              <span className="font-medium">{event.date} · {event.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="shrink-0 text-[var(--fg-sec)]" />
              <span className="line-clamp-1">{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / CTA Area */}
      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <AvailabilityBadge availability={event.availability} />
          <div className="text-right">
            <p className="text-[10px] uppercase font-semibold text-[var(--fg-sec)]">From</p>
            <p className="text-base font-black text-[var(--fg)] tracking-tight">${event.priceFrom}</p>
          </div>
        </div>

        <button className="w-full py-2.5 text-xs font-bold uppercase tracking-wider border border-[var(--fg)] text-[var(--fg)] rounded-xl hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] active:scale-[0.98]">
          Get Tickets
        </button>
      </div>
    </Link>
  );
}

// Compact horizontal card
export function CompactEventCard({ event, className = '' }) {
  const [imgSrc, setImgSrc] = useState(event.image || FALLBACK_IMAGE);

  return (
    <Link
      href={`/event/${event.slug}`}
      className={`group flex gap-3.5 p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all duration-200 ${className}`}
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[var(--bg-sec)]">
        <Image
          src={imgSrc}
          alt={event.title}
          fill
          sizes="64px"
          className="object-cover group-hover:scale-108 transition-transform duration-300"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          unoptimized
        />
      </div>
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <p className="text-[10px] font-bold text-[var(--fg-sec)] uppercase tracking-wider">{event.category}</p>
        <h4 className="text-xs font-bold text-[var(--fg)] line-clamp-1 mt-0.5">{event.title}</h4>
        <div className="flex items-center gap-1 text-[11px] text-[var(--fg-sec)] mt-1">
          <Calendar size={10} />
          <span>{event.date}</span>
        </div>
      </div>
      <div className="shrink-0 text-right flex flex-col justify-center">
        <p className="text-[10px] text-[var(--fg-sec)] uppercase font-semibold">From</p>
        <p className="text-xs font-black text-[var(--fg)]">${event.priceFrom}</p>
      </div>
    </Link>
  );
}

// Featured card for Hero area
export function FeaturedEventCard({ event, className = '' }) {
  const [imgSrc, setImgSrc] = useState(event.image || FALLBACK_IMAGE);

  return (
    <Link
      href={`/event/${event.slug}`}
      className={`group block relative rounded-2xl overflow-hidden border border-white/15 aspect-[3/4] ${className}`}
    >
      <Image
        src={imgSrc}
        alt={event.title}
        fill
        sizes="(max-width: 1024px) 100vw, 400px"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => setImgSrc(FALLBACK_IMAGE)}
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md border border-white/20">
          Featured Event
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">{event.category}</p>
        <h3 className="text-base md:text-lg font-black text-white leading-tight line-clamp-2 mb-2">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-white/80 text-xs mb-3">
          <MapPin size={12} />
          <span className="line-clamp-1 font-medium">{event.venue}, {event.city}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <span className="text-xs font-bold text-white">From ${event.priceFrom}</span>
          <span className="text-[10px] bg-white text-black font-black px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-white/90 transition-colors">
            Get Tickets
          </span>
        </div>
      </div>
    </Link>
  );
}

// City card
export function CityCard({ city, className = '' }) {
  const [imgSrc, setImgSrc] = useState(city.image || FALLBACK_IMAGE);

  return (
    <Link
      href={city.href}
      className={`group block relative rounded-2xl overflow-hidden aspect-[4/3] border border-[var(--border)] bg-[var(--bg-sec)] ${className}`}
    >
      <Image
        src={imgSrc}
        alt={city.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        onError={() => setImgSrc(FALLBACK_IMAGE)}
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-sm font-bold text-white tracking-tight">{city.name}</h3>
        <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium">{city.country}</p>
      </div>
    </Link>
  );
}

// Article/guide card
export function GuideCard({ guide, className = '' }) {
  const [imgSrc, setImgSrc] = useState(guide.image || FALLBACK_IMAGE);

  return (
    <Link
      href={guide.href}
      className={`group flex flex-col justify-between h-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all duration-300 hover:shadow-xl hover:shadow-black/10 ${className}`}
    >
      <div>
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--bg-sec)]">
          <Image
            src={imgSrc}
            alt={guide.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-2.5 py-0.5 rounded-md">
              {guide.category}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-1.5">
          <h3 className="text-xs font-bold text-[var(--fg)] line-clamp-2 leading-snug group-hover:text-[var(--fg)] transition-colors min-h-[2rem]">
            {guide.title}
          </h3>
          <p className="text-[11px] text-[var(--fg-sec)] line-clamp-2 leading-relaxed">{guide.description}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="pt-2 border-t border-[var(--border)] flex items-center gap-1.5 text-[11px] font-bold text-[var(--fg)] group-hover:gap-2 transition-all">
          <span>Read Guide</span>
          <Tag size={11} />
        </div>
      </div>
    </Link>
  );
}

// Trending search card
export function TrendingCard({ item, className = '' }) {
  const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);

  return (
    <Link
      href={item.href}
      className={`group block relative rounded-2xl overflow-hidden aspect-square shrink-0 border border-[var(--border)] bg-[var(--bg-sec)] ${className}`}
    >
      <Image
        src={imgSrc}
        alt={item.label}
        fill
        sizes="160px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        onError={() => setImgSrc(FALLBACK_IMAGE)}
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-[9px] uppercase font-bold tracking-widest text-white/60 mb-0.5">{item.category}</p>
        <h4 className="text-xs font-black text-white leading-tight">{item.label}</h4>
      </div>
    </Link>
  );
}
