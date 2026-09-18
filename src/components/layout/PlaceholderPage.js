import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

// Generic placeholder page — used for routes not yet fully implemented
export default function PlaceholderPage({ title = 'Coming Soon', description = 'This page is under construction. Check back soon!' }) {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl border border-[var(--border)] bg-[var(--bg-sec)] flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-black text-[var(--fg)]">TX</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[var(--fg)] mb-3">{title}</h1>
          <p className="text-[var(--fg-sec)] text-sm leading-relaxed mb-8">{description}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[var(--fg)] text-[var(--bg)] text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
