'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, Ticket, AlertCircle, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = signIn(email, password);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.message || 'Invalid login details. Please try again.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 600);
    }, 450);
  };

  return (
    <div className="relative w-full max-w-md my-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative auth-glass-card rounded-3xl p-7 sm:p-9 space-y-6 shadow-2xl border border-[var(--border)]"
      >
        {/* Animated Header & Brand Logo */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block"
          >
            <Logo width={160} height={42} className="mx-auto" />
          </motion.div>

          {/* Animated Tab Navigation (Sign In vs Sign Up) */}
          <div className="flex items-center justify-center p-1 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] max-w-xs mx-auto mt-4">
            <button
              type="button"
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-[var(--card)] text-[var(--fg)] shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Ticket size={13} className="text-[var(--fg)]" /> Sign In
            </button>
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectUrl)}&msg=${isBookingRedirect ? 'booking' : ''}`}
              className="flex-1 py-2 text-xs font-semibold rounded-xl text-[var(--fg-sec)] hover:text-[var(--fg)] transition-all flex items-center justify-center gap-1.5"
            >
              Create Account
            </Link>
          </div>

          <p className="text-xs text-[var(--fg-sec)] pt-1">
            {isBookingRedirect
              ? 'Sign in to your TicketX account to complete your ticket booking.'
              : 'Sign in to access your verified tickets, orders, and saved events.'}
          </p>
        </div>

        {/* Booking Guard Alert Banner */}
        <AnimatePresence>
          {isBookingRedirect && !success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-start gap-3 shadow-sm"
            >
              <Ticket size={18} className="shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="font-bold">Authentication Required</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Please sign in or create an account below to finish booking your tickets.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2.5 shadow-sm"
            >
              <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
              <span>Signed in successfully! Redirecting to checkout...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2.5 shadow-sm"
            >
              <AlertCircle size={18} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)]">
              Email Address
            </label>
            <div className="relative input-focus-glow rounded-2xl transition-all">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@example.com"
                required
                className="w-full pl-10 pr-4 py-3.5 text-xs sm:text-sm rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)]/60 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--fg-sec)] hover:text-[var(--fg)] font-semibold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative input-focus-glow rounded-2xl transition-all">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-3.5 text-xs sm:text-sm rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)]/60 focus:outline-none transition-all"
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </motion.button>
            </div>
          </div>

          {/* Animated Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[var(--bg)] border-t-transparent rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                Sign In to Account <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--fg-sec)]">
            Don&apos;t have a TicketX account?{' '}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectUrl)}&msg=${isBookingRedirect ? 'booking' : ''}`}
              className="font-bold text-[var(--fg)] hover:underline transition-colors underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Security Badges */}
        <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-[var(--fg-sec)]">
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>100% Buyer Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
            <UserCheck size={14} className="text-[var(--fg)] shrink-0" />
            <span>Verified Fan Tickets</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="min-h-[85vh] pt-20 bg-[var(--bg)] flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-center py-20 text-sm text-[var(--fg-sec)]">Loading sign in...</div>}>
          <SignInForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
