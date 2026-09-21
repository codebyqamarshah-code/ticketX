'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import TrendingSearches from '@/components/sections/TrendingSearches';
import HappeningThisWeekend from '@/components/sections/HappeningThisWeekend';
import TicketXPlusBanner from '@/components/sections/TicketXPlusBanner';
import PopularNearYou from '@/components/sections/PopularNearYou';
import CategorySection from '@/components/sections/CategorySection';
import { EntertainmentGuides, DiscoverMore } from '@/components/sections/EditorialSections';
import PopularCities from '@/components/sections/PopularCities';
import { Trophy, Palette, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-transparent">
        {/* 1. Header is rendered above */}

        {/* 2. Hero */}
        <HeroSection />

        {/* 3. Trending Searches */}
        <TrendingSearches />

        {/* 4. Happening This Weekend */}
        <HappeningThisWeekend />

        {/* 5. TicketX+ */}
        <TicketXPlusBanner />

        {/* 6. Popular Near You */}
        <PopularNearYou />

        {/* 7. Sports */}
        <div className="bg-[var(--bg-sec)]/50 border-t border-[var(--border)]">
          <CategorySection
            category="sports"
            title="Sports"
            href="/sports"
            icon={Trophy}
          />
        </div>

        {/* 8. Arts, Theater & Comedy */}
        <div className="bg-transparent border-t border-[var(--border)]">
          <CategorySection
            category="arts-theater"
            title="Arts, Theater & Comedy"
            href="/arts-theater"
            icon={Palette}
          />
        </div>

        {/* 9. Family */}
        <div className="bg-[var(--bg-sec)]/50 border-t border-[var(--border)]">
          <CategorySection
            category="family"
            title="Family"
            href="/family"
            icon={Heart}
          />
        </div>

        {/* 10. Entertainment Guides */}
        <EntertainmentGuides />

        {/* 11. Discover More */}
        <DiscoverMore />

        {/* 12. Popular Cities */}
        <PopularCities />
      </main>
      {/* 13. Footer */}
      <Footer />
    </>
  );
}
