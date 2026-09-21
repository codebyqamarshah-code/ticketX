import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { allGuides } from '@/data/guides';
import { Clock, Calendar, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Entertainment Guides & Festival Tips | TicketX Guides',
  description: 'Expert event guides, stadium tips, concert travel advice, and ticketing strategies from TicketX editors.',
};

export default function GuidesHubPage() {
  const featuredGuide = allGuides[0];
  const regularGuides = allGuides.slice(1);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 bg-[var(--bg)]">
        {/* Hero Section */}
        <section className="py-12 border-b border-[var(--border)] bg-[var(--bg-sec)]">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg)] mb-4">
                <BookOpen size={13} className="text-[var(--fg)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">TicketX Guides & Editorial</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[var(--fg)] tracking-tight mb-4">
                Your Ultimate Live Event Playbook
              </h1>
              <p className="text-sm sm:text-base text-[var(--fg-sec)] leading-relaxed">
                Insider tips, city entertainment guides, stadium advice, and concert strategies written by venue experts.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Main Article */}
        {featuredGuide && (
          <section className="py-12 border-b border-[var(--border)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
              <Link
                href={`/guides/${featuredGuide.slug}`}
                className="group relative block rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid lg:grid-cols-12 items-center">
                  <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:h-[450px] overflow-hidden bg-[var(--bg-sec)]">
                    <Image
                      src={featuredGuide.image}
                      alt={featuredGuide.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  </div>

                  <div className="lg:col-span-5 p-6 md:p-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-3 py-1 rounded-md">
                        {featuredGuide.category}
                      </span>
                      <span className="text-xs font-bold text-[var(--fg-sec)] flex items-center gap-1">
                        <Clock size={12} /> {featuredGuide.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[var(--fg)] group-hover:text-[var(--fg-sec)] transition-colors leading-tight">
                      {featuredGuide.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[var(--fg-sec)] leading-relaxed">
                      {featuredGuide.description}
                    </p>

                    <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--fg)] group-hover:gap-3 transition-all">
                      <span>Read Full Feature</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section className="py-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-xl font-black text-[var(--fg)] tracking-tight mb-8 flex items-center gap-2">
              <Sparkles size={18} /> All Guides & Articles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col justify-between rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)] transition-all duration-300 hover:shadow-xl"
                >
                  <div>
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--bg-sec)]">
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-2.5 py-0.5 rounded-md">
                          {guide.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--fg-sec)] font-semibold">
                        <Clock size={11} />
                        <span>{guide.readTime}</span>
                        <span>·</span>
                        <span>{guide.date}</span>
                      </div>

                      <h3 className="text-base font-bold text-[var(--fg)] group-hover:text-[var(--fg-sec)] transition-colors leading-snug line-clamp-2">
                        {guide.title}
                      </h3>

                      <p className="text-xs text-[var(--fg-sec)] line-clamp-2 leading-relaxed">
                        {guide.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--fg)]">
                      <span>Read Guide</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
