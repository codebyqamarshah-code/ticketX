import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CityCard } from '@/components/cards/EventCard';
import { popularCities } from '@/data/categories';
import { Globe } from 'lucide-react';

export const metadata = {
  title: 'Explore Live Events by City | TicketX',
  description: 'Find tickets for concerts, sports, theater, and entertainment in major cities worldwide.',
};

export default function CitiesLandingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)]">
        {/* Hero */}
        <section className="py-16 md:py-20 border-b border-[var(--border)] bg-[var(--bg-sec)]">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg)] mb-4">
                <Globe size={12} className="text-[var(--fg)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">Global Destinations</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight mb-3">
                Explore Events by City
              </h1>
              <p className="text-sm md:text-base text-[var(--fg-sec)] leading-relaxed">
                Discover live music, sporting events, theatrical performances, and entertainment near you or in top travel destinations.
              </p>
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-14">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {popularCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
