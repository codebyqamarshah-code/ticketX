'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowRight, ShieldCheck, Ticket, User, Mail, Lock } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      signUp(firstName, lastName, email, password);
      setLoading(false);
      router.push('/account');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--fg)] text-[var(--bg)] mx-auto flex items-center justify-center mb-3">
                <Ticket size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">Create your account</h1>
              <p className="text-xs text-[var(--fg-sec)] mt-1">
                Access 100% verified tickets, instant transfers, and seat maps
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Morgan"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                  Email Address
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

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)] transition-all"
                  />
                </div>
                <p className="text-[10px] text-[var(--fg-sec)] mt-1">Must be at least 6 characters</p>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[var(--border)] text-[var(--fg)] focus:ring-0 accent-[var(--fg)]"
                />
                <label htmlFor="agreeTerms" className="text-xs text-[var(--fg-sec)] leading-snug">
                  I agree to the <span className="underline text-[var(--fg)] cursor-pointer">Terms of Service</span> and <span className="underline text-[var(--fg)] cursor-pointer">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--fg-sec)]">
              Already have an account?{' '}
              <Link href="/signin" className="font-bold text-[var(--fg)] hover:underline">
                Sign In
              </Link>
            </div>

            {/* Guarantee Badge */}
            <div className="mt-6 p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              <p className="text-[11px] text-[var(--fg-sec)] leading-tight">
                <strong>100% Buyer Guarantee</strong> — Authentic tickets, on-time delivery.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
