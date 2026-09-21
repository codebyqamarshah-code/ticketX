/* eslint-disable @next/next/no-img-element */
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Newspaper, Calendar, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { entertainmentGuides, discoverArticles } from '@/data/categories';

export const metadata = {
  title: 'Blog & Live Event News | TicketX',
  description: 'Read the latest tour announcements, concert guides, ticket buying tips, and insider live event news from TicketX editorial.',
};

export default function BlogPage() {
  const allArticles = [...entertainmentGuides, ...discoverArticles];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto py-10 md:py-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <Newspaper size={14} className="text-[var(--fg)]" />
              <span>TicketX Blog & Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
              Stories, Guides & Live Event News
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)]">
              Your ultimate insider guide to stadium tours, presale tips, and local venue experiences.
            </p>
          </div>

          {/* Featured Article Hero Card */}
          <div className="mb-16">
            <Link
              href="/guides/most-anticipated-tours-2026"
              className="group relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10 shadow-lg shadow-black/5 hover:border-[var(--fg-sec)] transition-all"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto rounded-2xl overflow-hidden bg-[var(--bg-sec)]">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
                  alt="The Most Anticipated Tours of 2026"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)] mb-3">Featured Story</span>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--fg)] tracking-tight mb-4 group-hover:text-[var(--fg-sec)] transition-colors">
                  The Most Anticipated Stadium Tours of 2026
                </h2>
                <p className="text-sm text-[var(--fg-sec)] leading-relaxed mb-6">
                  From stadium icons to indie darlings — these are the must-see concert tours hitting North American and European venues this year.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-[var(--fg-sec)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> September 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> 5 min read
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {allArticles.map((article) => (
              <Link
                key={article.id}
                href={`/guides/${article.id}`}
                className="group p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--fg-sec)] transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-[var(--bg-sec)]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-sec)] px-2.5 py-1 rounded-full bg-[var(--bg-sec)] border border-[var(--border)] mb-3 inline-block">
                    {article.category || 'Guide'}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--fg)] mb-2 group-hover:text-[var(--fg-sec)] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[var(--fg-sec)] leading-relaxed line-clamp-3 mb-4">
                    {article.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--fg-sec)] pt-4 border-t border-[var(--border)]">
                  <span>Read Guide</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
