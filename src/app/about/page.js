import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ShieldCheck, Zap, HeartHandshake, Sparkles, ArrowRight, Users, Ticket, Globe, Trophy } from 'lucide-react';

export const metadata = {
  title: 'About Us | TicketX — Live Event Discovery & Ticketing',
  description: 'Learn about TicketX, our mission to transform live event ticketing with 100% authentic seats, transparent pricing, and interactive vector seat maps.',
};

const STATS = [
  { value: '10M+', label: 'Tickets Issued Worldwide' },
  { value: '99.9%', label: 'Verified Fan Authenticity' },
  { value: '500+', label: 'Partner Venues & Stadiums' },
  { value: '24/7', label: 'Dedicated VIP Support' },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: '100% Fan Guarantee',
    description: 'Every ticket sold on TicketX is verified and backed by our full money-back fan guarantee.',
  },
  {
    icon: Zap,
    title: 'Next-Gen Seat Maps',
    description: 'Our GPU-accelerated interactive seat maps give fans precise 60 FPS vector views before purchasing.',
  },
  {
    icon: HeartHandshake,
    title: 'Transparent Pricing',
    description: 'No hidden surprise fees at checkout. What you see on the map is what you pay.',
  },
  {
    icon: Sparkles,
    title: 'TicketX+ Perks',
    description: 'Unlock 0% buyer fees, priority presale access, and backstage VIP concierge support.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto py-12 md:py-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <Sparkles size={14} className="text-[var(--fg)]" />
              <span>About TicketX</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--fg)] tracking-tight leading-tight">
              Redefining Live Event Discovery & Ticketing
            </h1>
            <p className="mt-6 text-lg text-[var(--fg-sec)] leading-relaxed">
              TicketX is built for true live music, sports, and theater fans. We connect millions of attendees with authentic tickets, interactive venue seat maps, and transparent fan protection.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-10 border-y border-[var(--border)] mb-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center py-6 px-4 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)]">
                <p className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight">{stat.value}</p>
                <p className="text-xs md:text-sm text-[var(--fg-sec)] mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 md:p-12 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl shadow-black/5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mb-6">
                <Ticket size={24} className="text-[var(--fg)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">Our Mission</h2>
              <p className="text-[var(--fg-sec)] leading-relaxed">
                We believe live events create unforgettable life memories. Our mission is to eliminate ticket fraud, secondary market gouging, and confusing checkout steps by delivering an ultra-fast, transparent venue seat map experience.
              </p>
            </div>

            <div className="p-8 md:p-12 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl shadow-black/5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mb-6">
                <Globe size={24} className="text-[var(--fg)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">Global Reach, Local Access</h2>
              <p className="text-[var(--fg-sec)] leading-relaxed">
                From historic arena tours in Los Angeles and New York to intimate comedy club shows in Chicago and London, TicketX brings fans front-row access to over 50,000 live shows each year.
              </p>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[var(--fg)] tracking-tight">Why Fans Choose TicketX</h2>
              <p className="text-sm text-[var(--fg-sec)] mt-2">Built by fan advocates for the ultimate event night out</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val) => (
                <div key={val.title} className="p-6 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] hover:border-[var(--fg-sec)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mb-4">
                    <val.icon size={20} className="text-[var(--fg)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--fg)] mb-2">{val.title}</h3>
                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TicketX+ Membership CTA */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-sec)] p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">Membership Experience</span>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--fg)] mt-2 tracking-tight">
                Unlock Unlimited Presales & 0% Fees with TicketX+
              </h2>
              <p className="text-[var(--fg-sec)] mt-4 leading-relaxed">
                Join our premium fan circle to get early presale access, waived service charges, and dedicated concierge support for sold-out arena tours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
              <Link
                href="/ticketx-plus"
                className="px-6 py-3.5 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm rounded-xl text-center hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Explore TicketX+ <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 border border-[var(--border)] text-[var(--fg)] font-semibold text-sm rounded-xl text-center hover:bg-[var(--card)] transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
