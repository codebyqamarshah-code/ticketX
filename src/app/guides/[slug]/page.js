import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventCard } from '@/components/cards/EventCard';
import { getGuideBySlug, allGuides } from '@/data/guides';
import { getEventsByCategory } from '@/data/events';
import { ArrowLeft, Clock, Calendar, User, CheckCircle2, ArrowRight, Share2, Sparkles } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | TicketX',
    };
  }

  return {
    title: `${guide.title} | TicketX Event Guide`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      images: [{ url: guide.image }],
    },
  };
}

export default function GuideDetailPage({ params }) {
  const { slug } = use(params);
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Related Category Events
  const relatedEvents = getEventsByCategory(guide.relatedCategory || 'concerts').slice(0, 3);
  const otherGuides = allGuides.filter((g) => g.slug !== slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    image: guide.image,
    datePublished: guide.date,
    author: {
      '@type': 'Person',
      name: guide.author,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)] pb-20">
        {/* Header Breadcrumb Strip */}
        <section className="py-4 border-b border-[var(--border)] bg-[var(--bg-sec)]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Guides Hub
            </Link>

            <span className="text-xs font-mono font-bold text-[var(--fg-sec)]">TicketX Editorial</span>
          </div>
        </section>

        {/* Article Banner Header */}
        <section className="relative py-12 md:py-16 bg-[var(--bg-sec)] border-b border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-3 py-1 rounded-md">
                {guide.category}
              </span>
              <span className="text-xs font-bold text-[var(--fg-sec)] flex items-center gap-1">
                <Clock size={12} /> {guide.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight leading-tight">
              {guide.title}
            </h1>

            <p className="text-sm sm:text-base text-[var(--fg-sec)] leading-relaxed max-w-3xl font-medium">
              {guide.description}
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs font-semibold text-[var(--fg-sec)] border-t border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <User size={13} /> By {guide.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {guide.date}
              </span>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-2xl">
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Article Content (8 Cols) */}
              <article className="lg:col-span-8 space-y-8">
                {/* Key Takeaways Box */}
                {guide.takeaways && guide.takeaways.length > 0 && (
                  <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                      <Sparkles size={15} /> Key Article Takeaways
                    </h3>
                    <ul className="space-y-2">
                      {guide.takeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--fg)] font-medium leading-relaxed">
                          <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Article Sections */}
                {guide.sections &&
                  guide.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2 className="text-xl sm:text-2xl font-black text-[var(--fg)] tracking-tight">
                        {sec.heading}
                      </h2>
                      <p className="text-sm text-[var(--fg-sec)] leading-relaxed font-normal">
                        {sec.content}
                      </p>
                    </div>
                  ))}
              </article>

              {/* Sidebar Ticket Recommendations (4 Cols) */}
              <aside className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--fg)] flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <span>Trending Upcoming Events</span>
                    <Sparkles size={13} />
                  </h3>

                  <div className="space-y-3">
                    {relatedEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/event/${event.slug}`}
                        className="group flex gap-3 p-2.5 rounded-xl border border-[var(--border)] hover:border-[var(--fg-sec)] bg-[var(--bg-sec)] transition-all"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--card)]">
                          <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[var(--fg)] line-clamp-1">{event.title}</h4>
                          <p className="text-[10px] text-[var(--fg-sec)]">{event.venue} · {event.city}</p>
                          <span className="text-[10px] font-extrabold text-[var(--fg)]">From ${event.priceFrom}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Other Recommended Guides */}
        <section className="py-12 border-t border-[var(--border)] bg-[var(--bg-sec)] mt-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[var(--fg)] tracking-tight">More TicketX Guides</h2>
              <Link href="/guides" className="text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherGuides.map((g) => (
                <Link
                  key={g.id}
                  href={`/guides/${g.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--fg-sec)] transition-all shadow-md"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--bg-sec)] text-[var(--fg)] px-2 py-0.5 rounded border border-[var(--border)]">
                      {g.category}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--fg)] group-hover:text-[var(--fg-sec)] transition-colors line-clamp-2">
                      {g.title}
                    </h3>
                    <p className="text-xs text-[var(--fg-sec)] line-clamp-2">{g.description}</p>
                  </div>
                  <div className="pt-3 border-t border-[var(--border)] text-xs font-bold text-[var(--fg)] flex items-center justify-between mt-3">
                    <span>Read Guide</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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
