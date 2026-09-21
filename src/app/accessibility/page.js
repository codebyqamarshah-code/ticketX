import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Accessibility, ShieldCheck, Heart, Phone, ArrowRight, Eye, Volume2 } from 'lucide-react';

export const metadata = {
  title: 'Accessibility Services & ADA Seating | TicketX',
  description: 'Learn about TicketX commitment to accessible live event ticketing, ADA compliant seating, companion ticket options, and assistive venue services.',
};

const SERVICES = [
  {
    icon: Accessibility,
    title: 'Wheelchair & Accessible Seating',
    desc: 'Filter venue maps for accessible seating options featuring step-free access, wide aisles, and removable seats.',
  },
  {
    icon: Heart,
    title: 'Companion Tickets',
    desc: 'Reserve adjacent companion seats directly on our vector seat maps for guests assisting attendees.',
  },
  {
    icon: Volume2,
    title: 'Assistive Listening Devices',
    desc: 'Venues provide FM or infrared hearing loops for concert and theater events upon arrival.',
  },
  {
    icon: Eye,
    title: 'Sign Language & Sight Aids',
    desc: 'Request ASL interpreters or audio description services up to 14 days prior to showtime.',
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto py-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <Accessibility size={14} className="text-[var(--fg)]" />
              <span>Accessibility & Inclusion</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight">
              Live Events for Every Fan
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)] leading-relaxed">
              TicketX is dedicated to providing an inclusive live event experience. We work closely with venue operators to guarantee ADA-compliant ticket access for all fans.
            </p>
          </div>

          {/* Core Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {SERVICES.map((s) => (
              <div key={s.title} className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mb-6">
                  <s.icon size={24} className="text-[var(--fg)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--fg)] mb-2">{s.title}</h2>
                <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Policy Overview */}
          <div className="p-8 md:p-12 rounded-3xl bg-[var(--bg-sec)] border border-[var(--border)] mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">Our ADA Seating Policy</h2>
            <div className="space-y-4 text-sm text-[var(--fg-sec)] leading-relaxed">
              <p>
                <strong>100% Equal Access:</strong> Accessible seats are available for purchase at identical prices to non-accessible tickets in the same seating tier.
              </p>
              <p>
                <strong>Service Animals:</strong> Trained service animals assisting individuals with disabilities are welcome at all venues free of charge.
              </p>
              <p>
                <strong>Parking & Drop-Off Zones:</strong> Venues featured on TicketX provide dedicated ADA parking stalls near main entrance gates.
              </p>
            </div>
          </div>

          {/* Dedicated ADA Concierge Banner */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--fg)]">Need Special Accommodations?</h2>
            <p className="text-sm text-[var(--fg-sec)] mt-2">
              Our Accessibility Concierge Team is available 24/7 to assist with wheelchair seating requests or interpreter arrangements.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/contact?topic=accessibility"
                className="px-6 py-3 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
              >
                Contact ADA Concierge <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
