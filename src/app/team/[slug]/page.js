'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard } from '@/components/cards/EventCard';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { getTeamBySlug, teams } from '@/data/teams';
import { getEventsByTeam, getPopularEvents } from '@/data/events';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const team = getTeamBySlug(slug) || {
    id: 't-default',
    slug: slug || 'team',
    name: slug ? slug.replace('-', ' ').toUpperCase() : 'Team',
    sport: 'Sports',
    league: 'Professional',
    city: 'Los Angeles',
    venue: 'Main Arena',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    headerImage: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=1600&q=80',
    description: 'Championship contender sports franchise playing in world-class stadiums.',
    championships: 'Multiple Titles',
  };

  const teamEvents = getEventsByTeam(team.slug);
  const eventsToShow = teamEvents.length > 0 ? teamEvents : getPopularEvents().filter((e) => e.category === 'sports').slice(0, 3);
  const otherTeams = teams.filter((t) => t.slug !== team.slug).slice(0, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)]">
        {/* Hero */}
        <section className="relative py-16 md:py-24 border-b border-[var(--border)] overflow-hidden bg-[var(--bg-sec)]">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <Image src={team.headerImage || team.image} alt={team.name} fill className="object-cover" unoptimized />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/95 to-transparent" />

          <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-[var(--card)] shrink-0 shadow-xl">
                <Image src={team.image} alt={team.name} fill className="object-cover" unoptimized />
              </div>
              <div className="max-w-2xl flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-3 py-0.5 rounded-full">
                    {team.league} · {team.sport}
                  </span>
                  <FavoriteButton eventId={`team-${team.id}`} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight mb-2">{team.name}</h1>
                <p className="text-xs md:text-sm text-[var(--fg-sec)] leading-relaxed mb-4">{team.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--fg-sec)] pt-2 border-t border-[var(--border)]">
                  <div>
                    Home Venue: <span className="font-bold text-[var(--fg)]">{team.venue}</span>
                  </div>
                  <div>
                    Location: <span className="font-bold text-[var(--fg)]">{team.city}</span>
                  </div>
                  <div>
                    Titles: <span className="font-bold text-[var(--fg)]">{team.championships}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Games */}
        <section className="py-14">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[var(--fg)] tracking-tight mb-6">Upcoming Games & Matchups</h2>

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
                <p className="text-sm text-[var(--fg-sec)] font-semibold">No upcoming games scheduled at this moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Other Teams */}
        {otherTeams.length > 0 && (
          <section className="py-14 border-t border-[var(--border)] bg-[var(--bg-sec)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-6">Other Sports Franchises</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherTeams.map((t) => (
                  <Link
                    key={t.id}
                    href={`/team/${t.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[var(--bg-sec)]">
                      <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-108 transition-transform" unoptimized />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[var(--fg)]">{t.name}</h3>
                      <p className="text-xs text-[var(--fg-sec)]">{t.league} · {t.sport}</p>
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
