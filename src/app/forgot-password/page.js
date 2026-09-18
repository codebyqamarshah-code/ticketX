'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Mail, CheckCircle2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--fg)] text-[var(--bg)] mx-auto flex items-center justify-center mb-3">
                <KeyRound size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">Reset Password</h1>
              <p className="text-xs text-[var(--fg-sec)] mt-1">
                Enter your account email to receive a password reset link
              </p>
            </div>

            {submitted ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2 justify-center">
                  <CheckCircle2 size={18} />
                  <span>Password reset link sent! Check your inbox.</span>
                </div>
                <p className="text-xs text-[var(--fg-sec)]">
                  We sent instructions to <strong className="text-[var(--fg)]">{email}</strong>.
                </p>
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:underline pt-2"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@example.com"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? 'Sending link...' : 'Send Reset Link'}
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
