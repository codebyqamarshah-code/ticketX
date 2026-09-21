import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Crown, Zap, ShieldCheck, Star, Check, ArrowRight, Sparkles, Gift, PhoneCall } from 'lucide-react';

export const metadata = {
  title: 'TicketX+ | VIP Membership & Exclusive Presales',
  description: 'Join TicketX+ to unlock 0% buyer service fees, exclusive presale codes, VIP venue perks, and 24/7 dedicated concierge assistance.',
};

const BENEFITS = [
  {
    icon: Zap,
    title: 'Priority Presale Codes',
    description: 'Get first access to stadium tours, festival passes, and sold-out sports events before the general public.',
  },
  {
    icon: ShieldCheck,
    title: '0% Buyer Service Fees',
    description: 'Save up to 25% on every checkout with zero service charges or hidden fees on all tickets.',
  },
  {
    icon: Crown,
    title: 'VIP Concierge Hotline',
    description: 'Direct phone line and priority chat support for last-minute upgrades, venue parking, and group bookings.',
  },
  {
    icon: Gift,
    title: 'Complimentary Upgrades',
    description: 'Automatic entry into monthly seat upgrade raffles for Orchestra Pit and Club Level seating.',
  },
];

const FAQS = [
  {
    q: 'How does TicketX+ 0% service fees work?',
    a: 'As a TicketX+ member, all standard service fees are completely waived at checkout for every ticket purchase.',
  },
  {
    q: 'Can I cancel my membership anytime?',
    a: 'Yes, you can cancel your monthly or annual subscription with one click from your Account Settings with no penalty.',
  },
  {
    q: 'How do presale codes get delivered?',
    a: 'Presale codes are automatically emailed and displayed in your TicketX+ Dashboard 24 hours before tickets go live.',
  },
];

export default function TicketXPlusPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero Banner */}
          <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--bg-sec)] p-8 md:p-16 overflow-hidden mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] mb-6">
              <Crown size={14} className="text-[var(--fg)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg)]">VIP Fan Membership</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--fg)] leading-tight max-w-4xl mx-auto">
              TICKETX<span className="text-[var(--fg-sec)]">+</span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl font-semibold text-[var(--fg-sec)]">
              More Access. Zero Fees. Unmatched VIP Perks.
            </p>
            <p className="mt-4 text-base text-[var(--fg-sec)] max-w-2xl mx-auto leading-relaxed">
              Experience live music, sports, and theater like a true insider. Enjoy zero service charges on all purchases and exclusive access to presale drops.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup?plan=plus"
                className="px-8 py-4 bg-[var(--fg)] text-[var(--bg)] text-base font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Join TicketX+ Today <ArrowRight size={18} />
              </Link>
              <Link
                href="#pricing"
                className="px-8 py-4 border border-[var(--border)] text-[var(--fg)] text-base font-semibold rounded-2xl hover:bg-[var(--bg)] transition-all"
              >
                View Membership Plans
              </Link>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[var(--fg)] tracking-tight">Member Privileges</h2>
              <p className="text-sm text-[var(--fg-sec)] mt-2">Designed to elevate every concert and game day</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((b) => (
                <div key={b.title} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:border-[var(--fg-sec)] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mb-5">
                    <b.icon size={22} className="text-[var(--fg)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--fg)] mb-2">{b.title}</h3>
                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[var(--fg)] tracking-tight">Choose Your Membership</h2>
              <p className="text-sm text-[var(--fg-sec)] mt-2">Simple, transparent pricing. Cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <div className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Monthly Pass</span>
                  <div className="flex items-baseline gap-1 mt-3 mb-6">
                    <span className="text-4xl font-black text-[var(--fg)]">$9.99</span>
                    <span className="text-sm text-[var(--fg-sec)]">/ month</span>
                  </div>
                  <ul className="space-y-3.5 mb-8">
                    {['0% Buyer Service Fees', 'Presale Access Codes', 'Standard Member Support', 'Cancel Anytime'].map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-sm text-[var(--fg)] font-medium">
                        <Check size={16} className="text-[var(--fg)] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/signup?plan=monthly"
                  className="w-full py-3.5 border border-[var(--border)] text-[var(--fg)] font-bold text-sm rounded-xl text-center hover:bg-[var(--bg-sec)] transition-all"
                >
                  Start Monthly Membership
                </Link>
              </div>

              {/* Annual VIP Plan */}
              <div className="p-8 rounded-3xl bg-[var(--bg-sec)] border-2 border-[var(--fg)] relative flex flex-col justify-between shadow-2xl">
                <div className="absolute -top-3.5 right-6 px-3 py-1 bg-[var(--fg)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Best Value (Save 25%)
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Annual VIP Pass</span>
                  <div className="flex items-baseline gap-1 mt-3 mb-6">
                    <span className="text-4xl font-black text-[var(--fg)]">$89</span>
                    <span className="text-sm text-[var(--fg-sec)]">/ year</span>
                  </div>
                  <ul className="space-y-3.5 mb-8">
                    {[
                      '0% Buyer Service Fees on Unlimited Orders',
                      'Priority Presale Access 24h Early',
                      '24/7 Dedicated VIP Concierge Hotline',
                      'Free Automatic Seat Upgrade Raffles',
                      'Exclusive Member Event Invites',
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-sm text-[var(--fg)] font-medium">
                        <Check size={16} className="text-[var(--fg)] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/signup?plan=annual"
                  className="w-full py-3.5 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm rounded-xl text-center hover:opacity-90 transition-all shadow-lg"
                >
                  Join Annual VIP ($89/yr)
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--fg)] text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                  <h3 className="text-base font-bold text-[var(--fg)] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{faq.a}</p>
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
