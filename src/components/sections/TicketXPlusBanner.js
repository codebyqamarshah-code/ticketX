'use client';

import Link from 'next/link';
import { ArrowRight, Star, Zap, Crown, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: Zap, label: 'Early Access', desc: 'Get tickets before the public' },
  { icon: Star, label: 'Exclusive Offers', desc: 'Members-only deals and discounts' },
  { icon: Crown, label: 'VIP Experiences', desc: 'Backstage passes and meet & greets' },
  { icon: ShieldCheck, label: 'Presales', desc: 'Access to presale codes anytime' },
];

export default function TicketXPlusBanner() {
  return (
    <section className="py-14 bg-[var(--bg)] border-y border-[var(--border)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-sec)]">
          {/* Subtle decorative lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, var(--fg) 0, var(--fg) 1px, transparent 0, transparent 50%)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative px-8 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
            {/* Left — Copy */}
            <div className="flex-1 min-w-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg)] mb-5">
                <Crown size={12} className="text-[var(--fg)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg)]">Membership</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[var(--fg)] leading-tight mb-3">
                TICKETX<span className="text-[var(--fg-sec)]">+</span>
                <br />
                <span className="text-[var(--fg-sec)]">More access.</span>
              </h2>
              <p className="text-sm text-[var(--fg-sec)] leading-relaxed max-w-sm mb-6">
                Join TicketX+ for exclusive benefits — from presale access to VIP experiences. One membership, infinite possibilities.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--fg)] text-[var(--bg)] text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200"
                >
                  Explore TicketX+
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--border)] text-[var(--fg)] text-sm font-semibold rounded-xl hover:bg-[var(--bg)] transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right — Feature pills */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:shrink-0">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  className="flex flex-col gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-sec)] border border-[var(--border)]">
                    <f.icon size={14} className="text-[var(--fg)]" />
                  </div>
                  <p className="text-sm font-bold text-[var(--fg)]">{f.label}</p>
                  <p className="text-xs text-[var(--fg-sec)] leading-snug">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
