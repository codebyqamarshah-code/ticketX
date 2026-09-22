'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { CityCard } from '@/components/cards/EventCard';
import { popularCities } from '@/data/categories';
import { Globe } from 'lucide-react';

export default function PopularCities() {
  return (
    <section className="py-14 bg-transparent border-t border-[var(--border)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          title="Popular Cities"
          subtitle="Explore events by city"
          href="/cities"
          icon={Globe}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCities.map((city, i) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <CityCard city={city} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
