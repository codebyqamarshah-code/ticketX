'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, Ticket, AlertCircle } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';
  const isBookingRedirect = searchParams.get('msg') === 'booking' || redirectUrl.includes('tickets') || redirectUrl.includes('checkout');

  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    const res = signIn(email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid login details.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(redirectUrl);
    }, 600);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl space-y-6 my-12">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <Logo width={150} height={40} className="mx-auto" />
        <h1 className="text-2xl font-black text-[var(--fg)] tracking-tight pt-2">Welcome Back</h1>
        <p className="text-xs text-[var(--fg-sec)]">
          {isBookingRedirect
            ? 'Sign in to your TicketX account to complete your ticket booking.'
            : 'Sign in to access your tickets, orders, and saved events.'}
        </p>
      </div>

      {/* Booking Guard Alert Banner */}
      {isBookingRedirect && !success && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-start gap-3">
          <Ticket size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Authentication Required</p>
            <p className="text-[11px] opacity-90 mt-0.5">Please sign in or create an account below to select and book your tickets.</p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} /> Signed in successfully! Redirecting...
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.morgan@example.com"
              required
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Password</label>
            <Link href="/forgot-password" className="text-xs text-[var(--fg-sec)] hover:text-[var(--fg)] font-semibold">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          Sign In <ArrowRight size={14} />
        </button>
      </form>

      <div className="text-center pt-4 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--fg-sec)]">
          Don&apos;t have an account?{' '}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectUrl)}&msg=${isBookingRedirect ? 'booking' : ''}`}
            className="font-bold text-[var(--fg)] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)] flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-center py-20 text-sm text-[var(--fg-sec)]">Loading sign in...</div>}>
          <SignInForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
