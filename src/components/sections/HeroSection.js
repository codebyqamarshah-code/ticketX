'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchEvents } from '@/data/events';

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggRef = useRef(null);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      const res = searchEvents(val).slice(0, 5);
      setSuggestions(res);
      setShowSuggestions(res.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handle = (e) => {
      if (suggRef.current && !suggRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleKey = (e) => {
    if (e.key === 'Escape') { setShowSuggestions(false); inputRef.current?.blur(); }
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // 4 Featured Cards for the Right 2x2 Grid with high-contrast, crystal clear imagery
  const rightGridCards = [
    {
      id: 'h1',
      title: 'Summer Music Festival 2026',
      subtitle: 'Good Vibes Only',
      cta: 'Get Tickets',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      href: '/concerts',
      overlay: 'bg-gradient-to-t from-black/70 via-black/15 to-transparent',
    },
    {
      id: 'h2',
      title: 'WICKED The Musical',
      subtitle: "Broadway's Biggest Hit",
      cta: 'Get Tickets',
      image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
      href: '/event/hamilton-broadway-ny',
      overlay: 'bg-gradient-to-t from-black/70 via-black/15 to-transparent',
    },
    {
      id: 'h3',
      title: 'Family Fun For Everyone',
      subtitle: 'Unforgettable Memories',
      cta: 'Explore Events',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
      href: '/family',
      overlay: 'bg-gradient-to-t from-black/60 via-black/10 to-transparent',
    },
    {
      id: 'h4',
      title: 'WORLD OF MAGIC',
      subtitle: 'Live Your Story',
      cta: 'Get Tickets',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
      href: '/arts-theater',
      overlay: 'bg-gradient-to-t from-black/70 via-black/15 to-transparent',
    },
  ];

  return (
    <section className="relative bg-[var(--bg)] pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">

          {/* LEFT HERO MAIN BANNER (7 Columns on Large Screens) */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex-1 rounded-3xl border border-[var(--border)] bg-[var(--card)] overflow-hidden p-6 md:p-10 flex flex-col justify-between min-h-[460px] md:min-h-[520px] shadow-lg"
            >
              {/* Concert Image background right overlay — Vivid clear visibility */}
              <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 opacity-85 dark:opacity-75 pointer-events-none overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
                  alt="Live Concert Crowd and Stage Lights"
                  fill
                  priority
                  className="object-cover object-right"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--card)] via-[var(--card)]/40 to-transparent" />
              </div>

              {/* Top Headline + Subtitle */}
              <div className="relative z-10 max-w-xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[var(--fg)] tracking-tighter leading-[0.95] mb-4">
                  LIVE<br />
                  MORE<br />
                  TOGETHER
                </h1>
                <p className="text-xs sm:text-sm text-[var(--fg-sec)] font-medium leading-relaxed max-w-md">
                  Unforgettable events. Real connections. Get your tickets to the moments that matter.
                </p>
              </div>

              {/* Main Pill Search Input */}
              <div className="relative z-10 mt-8 mb-4">
                <div className="relative flex items-center bg-[var(--bg-sec)] border border-[var(--border)] rounded-full shadow-inner p-1.5 focus-within:border-[var(--fg-sec)] transition-all">
                  <Search size={18} className="ml-4 text-[var(--fg-sec)] shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onKeyDown={handleKey}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    placeholder="Search artists, teams, venues, or events..."
                    className="flex-1 px-3 py-2.5 text-xs sm:text-sm text-[var(--fg)] bg-transparent placeholder:text-[var(--fg-sec)] focus:outline-none font-medium"
                    aria-label="Search events"
                  />
                  <button
                    onClick={() => {
                      if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className="px-6 py-2.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-extrabold uppercase tracking-wider rounded-full hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    Search
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div
                    ref={suggRef}
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/20 z-30 overflow-hidden"
                    role="listbox"
                  >
                    {suggestions.map((event) => (
                      <Link
                        key={event.id}
                        href={`/event/${event.slug}`}
                        onClick={() => { setShowSuggestions(false); setQuery(''); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-sec)] transition-colors group"
                        role="option"
                      >
                        <Search size={13} className="text-[var(--fg-sec)] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--fg)] line-clamp-1">{event.title}</p>
                          <p className="text-[11px] text-[var(--fg-sec)]">{event.venue} · {event.city}</p>
                        </div>
                        <ChevronRight size={14} className="ml-auto text-[var(--fg-sec)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Popular Pills Below Search */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-xs font-bold text-[var(--fg-sec)]">Popular:</span>
                  {['Taylor Swift', 'NBA', 'Comedy', 'Los Angeles', 'Broadway'].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] hover:border-[var(--fg-sec)] transition-all cursor-pointer"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT 2x2 FEATURED GRID CARDS (5 Columns on Large Screens) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rightGridCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={card.href}
                  className="group relative block rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] aspect-[4/3] sm:aspect-auto sm:h-[250px] p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    unoptimized
                  />
                  <div className={`absolute inset-0 ${card.overlay}`} />

                  {/* Top Content */}
                  <div className="relative z-10">
                    <h3 className="text-base md:text-lg font-black text-white leading-tight drop-shadow-md">
                      {card.title}
                    </h3>
                    <p className="text-xs font-semibold text-white/90 mt-1 drop-shadow">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Bottom Pill CTA */}
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 text-black text-xs font-extrabold rounded-full shadow-md group-hover:bg-white group-hover:scale-105 transition-all">
                      <span>{card.cta}</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
