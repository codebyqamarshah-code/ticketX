import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Megaphone, Download, Mail, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Press & Newsroom | TicketX',
  description: 'Read official press releases, media coverage, and media assets for TicketX live event discovery platform.',
};

const PRESS_RELEASES = [
  {
    date: 'August 14, 2026',
    title: 'TicketX Unveils GPU-Accelerated 60 FPS Vector Seat Maps Across 500+ Arenas',
    excerpt: 'Next-gen rendering engine brings 60 FPS smooth vector seat mapping and progressive zoom detail down to individual chair circles.',
    link: '#',
  },
  {
    date: 'June 02, 2026',
    title: 'TicketX Expands Fan Protection Guarantee with 0% Buyer Fee Option for Members',
    excerpt: 'TicketX+ membership program reaches 1M subscribers, offering zero buyer service charges and priority presale access.',
    link: '#',
  },
  {
    date: 'March 18, 2026',
    title: 'TicketX Partners with Top Global Venues for 100% Mobile Barcode Integration',
    excerpt: 'Direct venue barcode API integration prevents secondary market counterfeit passes and speeds up entrance gates by 40%.',
    link: '#',
  },
];

const MEDIA_COVERAGE = [
  { outlet: 'Billboard', quote: 'TicketX is changing the game for live music ticketing with transparent fan-first pricing.' },
  { outlet: 'TechCrunch', quote: 'Their 60 FPS vector venue seat map engine sets a new technical benchmark for event platforms.' },
  { outlet: 'Rolling Stone', quote: 'The smoothest ticket buying experience available for stadium concertgoers today.' },
  { outlet: 'Forbes', quote: 'TicketX is disrupting secondary ticket markups with verified 100% fan authenticity.' },
];

export default function PressPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto py-10 md:py-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <Megaphone size={14} className="text-[var(--fg)]" />
              <span>Press & Newsroom</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
              TicketX News & Media Resources
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)]">
              Official press announcements, brand assets, and news coverage about TicketX.
            </p>
          </div>

          {/* Media Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {MEDIA_COVERAGE.map((mc) => (
              <div key={mc.outlet} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
                <p className="text-lg font-black text-[var(--fg)] mb-3">{mc.outlet}</p>
                <p className="text-xs text-[var(--fg-sec)] leading-relaxed italic">&ldquo;{mc.quote}&rdquo;</p>
              </div>
            ))}
          </div>

          {/* Press Releases List */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-[var(--fg)] mb-6 border-b border-[var(--border)] pb-3">
              Press Releases
            </h2>
            <div className="space-y-6">
              {PRESS_RELEASES.map((pr) => (
                <div key={pr.title} className="p-6 md:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--fg-sec)] transition-all">
                  <span className="text-xs font-semibold text-[var(--fg-sec)] flex items-center gap-1.5 mb-2">
                    <Calendar size={13} /> {pr.date}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--fg)] mb-2">{pr.title}</h3>
                  <p className="text-sm text-[var(--fg-sec)] leading-relaxed mb-4">{pr.excerpt}</p>
                  <a href={pr.link} className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--fg)] hover:underline">
                    Read Full Release <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Media Assets & Contact Banner */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-sec)] p-8 md:p-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[var(--fg)]">Media & Brand Assets</h2>
              <p className="text-sm text-[var(--fg-sec)] mt-2 leading-relaxed">
                Download official TicketX logos, brand guidelines, executive headshots, and high-res product screenshots.
              </p>
              <button className="mt-5 inline-flex items-center gap-2 px-5 py-3 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold rounded-xl hover:opacity-90 transition-all">
                Download Media Kit (ZIP) <Download size={14} />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="text-lg font-bold text-[var(--fg)] mb-2 flex items-center gap-2">
                <Mail size={18} /> Press Inquiries
              </h3>
              <p className="text-xs text-[var(--fg-sec)] leading-relaxed mb-4">
                For media interviews, commentary, or press credentials, reach our communications team directly:
              </p>
              <a href="mailto:press@ticketx.com" className="text-sm font-bold text-[var(--fg)] underline">
                press@ticketx.com
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
