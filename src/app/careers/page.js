import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Briefcase, Ticket, Laptop, Heart, DollarSign, MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Careers at TicketX | Open Positions & Company Culture',
  description: 'Join the TicketX team! Explore open engineering, design, marketing, and product roles and help us build the next generation of live event discovery.',
};

const PERKS = [
  {
    icon: Ticket,
    title: '$1,500 Annual Event Ticket Stipend',
    desc: 'We pay for your tickets! Attend your favorite concerts, sports games, and theater shows on us every year.',
  },
  {
    icon: Laptop,
    title: '100% Remote-First Work Culture',
    desc: 'Work from anywhere in North America or Europe with flexible hours and top-tier home office gear setup.',
  },
  {
    icon: Heart,
    title: 'Unlimited PTO & Wellness Days',
    desc: 'Rest and recharge whenever you need. Plus comprehensive health, dental, and vision insurance coverage.',
  },
  {
    icon: DollarSign,
    title: 'Competitive Equity & 401(k) Match',
    desc: 'Generous stock options, competitive market salaries, and 4% matching on retirement 401(k) contributions.',
  },
];

const POSITIONS = [
  {
    title: 'Senior Frontend Engineer (Next.js / React / Canvas)',
    department: 'Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
  },
  {
    title: 'Lead Product Designer (UX/UI)',
    department: 'Design',
    location: 'Remote (US/EU)',
    type: 'Full-time',
  },
  {
    title: 'Principal Backend Engineer (Node.js / Distributed Systems)',
    department: 'Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
  },
  {
    title: 'Senior Growth Marketing Manager',
    department: 'Marketing',
    location: 'New York / Remote',
    type: 'Full-time',
  },
  {
    title: 'VIP Customer Experience Advocate',
    department: 'Support',
    location: 'Los Angeles / Remote',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto py-10 md:py-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <Briefcase size={14} className="text-[var(--fg)]" />
              <span>Join Our Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
              Build the Future of Live Event Ticketing
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)]">
              We are a remote-first team of fan advocates, engineers, and creators building the ultimate event discovery platform.
            </p>
          </div>

          {/* Perks Grid */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[var(--fg)] tracking-tight">Why You Will Love Working Here</h2>
              <p className="text-sm text-[var(--fg-sec)] mt-2">World-class benefits designed for passionate event fans</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PERKS.map((p) => (
                <div key={p.title} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mb-5">
                    <p.icon size={22} className="text-[var(--fg)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--fg)] mb-2">{p.title}</h3>
                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Roles Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--fg)]">Open Positions</h2>
                <p className="text-xs text-[var(--fg-sec)] mt-1">Found a role that fits your superpower?</p>
              </div>
              <span className="text-xs font-bold text-[var(--fg-sec)] px-3 py-1 rounded-full bg-[var(--bg-sec)] border border-[var(--border)]">
                {POSITIONS.length} Openings
              </span>
            </div>

            <div className="space-y-4">
              {POSITIONS.map((pos) => (
                <div
                  key={pos.title}
                  className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--fg-sec)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-sec)] px-2.5 py-0.5 rounded-full bg-[var(--bg-sec)] border border-[var(--border)] mb-2 inline-block">
                      {pos.department}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--fg)] group-hover:text-[var(--fg-sec)] transition-colors">
                      {pos.title}
                    </h3>
                    <p className="text-xs text-[var(--fg-sec)] flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {pos.location}</span>
                      <span>•</span>
                      <span>{pos.type}</span>
                    </p>
                  </div>
                  <Link
                    href={`/contact?topic=careers&role=${encodeURIComponent(pos.title)}`}
                    className="px-5 py-2.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold rounded-xl shrink-0 text-center hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                  >
                    Apply Now <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
