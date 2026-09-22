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
import AnimatedSection from '@/components/common/AnimatedSection';
import { Trophy, Palette, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-transparent">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Trending Searches */}
        <AnimatedSection direction="up" delay={0.1}>
          <TrendingSearches />
        </AnimatedSection>

        {/* 3. Happening This Weekend */}
        <AnimatedSection direction="up">
          <HappeningThisWeekend />
        </AnimatedSection>

        {/* 4. TicketX+ */}
        <AnimatedSection direction="up" scale={true}>
          <TicketXPlusBanner />
        </AnimatedSection>

        {/* 5. Popular Near You */}
        <AnimatedSection direction="up">
          <PopularNearYou />
        </AnimatedSection>

        {/* 6. Sports */}
        <AnimatedSection direction="up">
          <div className="bg-transparent border-t border-[var(--border)]">
            <CategorySection
              category="sports"
              title="Sports"
              href="/sports"
              icon={Trophy}
            />
          </div>
        </AnimatedSection>

        {/* 7. Arts, Theater & Comedy */}
        <AnimatedSection direction="up">
          <div className="bg-transparent border-t border-[var(--border)]">
            <CategorySection
              category="arts-theater"
              title="Arts, Theater & Comedy"
              href="/arts-theater"
              icon={Palette}
            />
          </div>
        </AnimatedSection>

        {/* 8. Family */}
        <AnimatedSection direction="up">
          <div className="bg-transparent border-t border-[var(--border)]">
            <CategorySection
              category="family"
              title="Family"
              href="/family"
              icon={Heart}
            />
          </div>
        </AnimatedSection>

        {/* 9. Entertainment Guides */}
        <AnimatedSection direction="up">
          <EntertainmentGuides />
        </AnimatedSection>

        {/* 10. Discover More */}
        <AnimatedSection direction="up">
          <DiscoverMore />
        </AnimatedSection>

        {/* 11. Popular Cities */}
        <AnimatedSection direction="up">
          <PopularCities />
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
}
