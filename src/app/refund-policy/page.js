import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy & 100% Fan Guarantee | TicketX',
  description: 'Learn about TicketX 100% Buyer Guarantee, full refund policies for cancelled events, postponed shows, on-time mobile delivery, and authentic seat protection.',
};

const COVERAGE = [
  {
    icon: CheckCircle,
    title: '100% Authentic Tickets',
    desc: 'Every ticket sold on TicketX is verified by venue barcode systems. If a ticket is invalid, we provide 200% replacement or full refund.',
  },
  {
    icon: RefreshCw,
    title: 'Cancelled Events = Full Refund',
    desc: 'If an event is officially cancelled and not rescheduled, a 100% automatic refund will be credited to your original payment method.',
  },
  {
    icon: Clock,
    title: 'On-Time Mobile Barcode Delivery',
    desc: 'Your digital mobile tickets will always arrive in time for venue entry, or we will replace your seats free of charge.',
  },
  {
    icon: ShieldCheck,
    title: 'Valid Entry Guaranteed',
    desc: 'Your tickets will provide valid entry into the venue gate or 100% money-back fan protection.',
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto py-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <ShieldCheck size={14} className="text-[var(--fg)]" />
              <span>100% Fan Buyer Protection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight">
              TicketX Refund Policy & Guarantee
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)] leading-relaxed">
              Buy with complete peace of mind. Every purchase on TicketX is backed by our industry-leading 100% Buyer Guarantee.
            </p>
          </div>

          {/* Coverage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {COVERAGE.map((c) => (
              <div key={c.title} className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mb-6">
                  <c.icon size={24} className="text-[var(--fg)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--fg)] mb-2">{c.title}</h2>
                <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Detailed Policy Rules */}
          <div className="p-8 md:p-12 rounded-3xl bg-[var(--bg-sec)] border border-[var(--border)] mb-16 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[var(--fg)]">Specific Policy Details</h2>

            <div className="space-y-4 text-sm text-[var(--fg-sec)] leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-[var(--fg)] mb-1">1. Cancelled Events</h3>
                <p>
                  If an event is cancelled with no rescheduled date, TicketX will issue a 100% refund of the purchase price (including all fees) within 7–10 business days.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--fg)] mb-1">2. Postponed or Rescheduled Events</h3>
                <p>
                  If an event is postponed or rescheduled, your tickets remain valid for the new date. Refunds are not issued for rescheduled dates unless required by local law, but you may relist your tickets on TicketX Resale anytime.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--fg)] mb-1">3. Buyer Cancellations & Returns</h3>
                <p>
                  Due to live event inventory locks, all ticket sales are final and non-refundable once an order is confirmed, except under our 100% Buyer Guarantee scenarios above.
                </p>
              </div>
            </div>
          </div>

          {/* Claim Banner */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--fg)]">Need to Submit a Refund Claim?</h2>
            <p className="text-sm text-[var(--fg-sec)] mt-2">
              Our Fan Protection Team processes claim requests within 24 hours.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/contact?topic=refund"
                className="px-6 py-3 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
              >
                File a Guarantee Claim <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
