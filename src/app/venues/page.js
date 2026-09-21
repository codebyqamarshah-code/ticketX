import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { MapPin, Users, Ticket, ArrowRight, Building2, Search } from 'lucide-react';
import { venues } from '@/data/venues';

export const metadata = {
  title: 'Venues Directory & Interactive Seat Maps | TicketX',
  description: 'Explore world-famous arenas, stadiums, and theaters. View interactive seating maps, capacity details, and upcoming events for top venues.',
};

export default function VenuesDirectoryPage() {
  const venueList = Object.values(venues);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto py-10 md:py-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <Building2 size={14} className="text-[var(--fg)]" />
              <span>Venues & Arenas Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
              World-Class Venues & Seating Maps
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)]">
              Discover legendary arenas, historic theaters, and modern sports stadiums with 60 FPS vector seat maps.
            </p>
          </div>

          {/* Venues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {venueList.map((v) => (
              <div
                key={v.id}
                className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--fg-sec)] transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center">
                      <Building2 size={20} className="text-[var(--fg)]" />
                    </div>
                    <span className="text-xs font-bold text-[var(--fg-sec)] px-2.5 py-1 rounded-full bg-[var(--bg-sec)] border border-[var(--border)]">
                      Capacity: {v.capacity.toLocaleString()}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--fg)] mb-2 group-hover:text-[var(--fg-sec)] transition-colors">
                    {v.name}
                  </h2>

                  <p className="text-xs text-[var(--fg-sec)] flex items-center gap-1.5 mb-4">
                    <MapPin size={13} className="shrink-0 text-red-500" />
                    <span>{v.city}, {v.state}</span>
                  </p>

                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed line-clamp-3 mb-6">
                    {v.description || `Premier venue hosting major tour concerts, championship sports, and live theater productions.`}
                  </p>
                </div>

                <Link
                  href={`/venue/${v.slug}`}
                  className="w-full py-3 bg-[var(--fg)] text-[var(--bg)] font-bold text-xs rounded-xl text-center hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  View Venue & Seat Maps <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
