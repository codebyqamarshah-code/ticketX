import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Search, HelpCircle, ShieldCheck, Ticket, RefreshCw, Smartphone, Accessibility, PhoneCall, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Help Center & Fan Support | TicketX',
  description: 'Find answers to your questions about ticket buying, mobile entry, refunds, event cancellations, transfers, and accessibility services at TicketX.',
};

const CATEGORIES = [
  {
    icon: Ticket,
    title: 'Buying & Orders',
    desc: 'How to purchase tickets, service fee details, and order confirmations.',
    link: '#buying',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ticket Entry',
    desc: 'Accessing your digital tickets on iOS or Android at event gates.',
    link: '#entry',
  },
  {
    icon: ShieldCheck,
    title: '100% Fan Guarantee & Refunds',
    desc: 'Coverage for cancelled shows, postponed dates, and authentic seat guarantee.',
    link: '#refunds',
  },
  {
    icon: RefreshCw,
    title: 'Transferring & Selling',
    desc: 'Sending tickets to friends or listing unwanted seats for fan resale.',
    link: '#transfer',
  },
  {
    icon: Accessibility,
    title: 'Accessibility Services',
    desc: 'Wheelchair seating, companion passes, and ADA venue accommodations.',
    link: '#accessibility',
  },
  {
    icon: PhoneCall,
    title: 'Contact Customer Support',
    desc: '24/7 Live chat, email support, and VIP phone concierge hotline.',
    link: '/contact',
  },
];

const FAQS = [
  {
    category: 'Buying & Orders',
    id: 'buying',
    questions: [
      {
        q: 'How do I receive my tickets after purchasing?',
        a: 'All tickets are issued digitally. You can access your mobile barcode anytime under your TicketX Account > My Tickets or via the confirmation email link.',
      },
      {
        q: 'Can I select exact row and seat numbers?',
        a: 'Yes! Our GPU-accelerated vector seat maps show exact section, row, and seat numbers down to individual chair circles.',
      },
    ],
  },
  {
    category: '100% Fan Guarantee & Refunds',
    id: 'refunds',
    questions: [
      {
        q: 'What happens if an event is cancelled?',
        a: 'If an event is officially cancelled and not rescheduled, you will automatically receive a 100% full refund to your original payment method.',
      },
      {
        q: 'What if an event is postponed or rescheduled?',
        a: 'Your tickets remain 100% valid for the new rescheduled date. If you cannot attend the new date, you can list your tickets on TicketX Resale with 0 seller markup.',
      },
    ],
  },
  {
    category: 'Mobile Entry',
    id: 'entry',
    questions: [
      {
        q: 'Do I need to print my tickets?',
        a: 'No! Paper printouts are not accepted at modern venues. Simply show the rotating mobile barcode on your phone screen at the venue gate.',
      },
    ],
  },
  {
    category: 'Accessibility Services',
    id: 'accessibility',
    questions: [
      {
        q: 'How do I purchase accessible (ADA) seating?',
        a: 'Accessible seats are marked with the blue wheelchair icon on our venue maps. You can also view our full Accessibility Policy page or contact our ADA Concierge.',
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto py-10 md:py-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <HelpCircle size={14} className="text-[var(--fg)]" />
              <span>Fan Support & Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
              How Can We Help You Today?
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)]">
              Search our knowledge base or browse common topics below.
            </p>

            {/* Search Box */}
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
              <input
                type="text"
                placeholder="Search topics (e.g. mobile entry, refunds, presales)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)] shadow-lg shadow-black/5 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Help Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                href={cat.link}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--fg-sec)] transition-all group shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <cat.icon size={22} className="text-[var(--fg)]" />
                </div>
                <h2 className="text-lg font-bold text-[var(--fg)] mb-1 flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight size={16} className="text-[var(--fg-sec)] group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>

          {/* Quick FAQ Sections */}
          <div className="max-w-4xl mx-auto mb-20 space-y-12">
            {FAQS.map((sec) => (
              <div key={sec.category} id={sec.id} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[var(--fg)] mb-6 border-b border-[var(--border)] pb-3">
                  {sec.category}
                </h2>
                <div className="space-y-4">
                  {sec.questions.map((q) => (
                    <div key={q.q} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                      <h3 className="text-base font-bold text-[var(--fg)] mb-2">{q.q}</h3>
                      <p className="text-sm text-[var(--fg-sec)] leading-relaxed">{q.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Banner */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-sec)] p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Still Need Help?</h2>
            <p className="text-sm text-[var(--fg-sec)] mt-2 max-w-md mx-auto">
              Our 24/7 Support Team is ready to assist you with order issues, venue entry, or account inquiries.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm rounded-xl hover:opacity-90 transition-all"
              >
                Contact Fan Support
              </Link>
              <Link
                href="/refund-policy"
                className="px-6 py-3 border border-[var(--border)] text-[var(--fg)] font-semibold text-sm rounded-xl hover:bg-[var(--card)] transition-all"
              >
                View Refund Policy
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
