'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { GuideCard } from '@/components/cards/EventCard';
import { entertainmentGuides, discoverArticles } from '@/data/categories';
import { BookOpen, Compass } from 'lucide-react';

export function EntertainmentGuides() {
  return (
    <section className="py-14 bg-transparent border-y border-[var(--border)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          title="Entertainment Guides"
          subtitle="Buy smarter, experience better"
          href="/help"
          icon={BookOpen}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {entertainmentGuides.map((guide, i) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <GuideCard guide={guide} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DiscoverMore() {
  return (
    <section className="py-14 bg-transparent">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          title="Discover More"
          subtitle="Stories, tips, and inspiration for live events"
          href="/about"
          icon={Compass}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {discoverArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <GuideCard guide={article} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
