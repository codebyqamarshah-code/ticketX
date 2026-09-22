'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Logo from '@/components/ui/Logo';
import { ArrowRight, ShieldCheck, Ticket, User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, LockKeyhole } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';
  const isBookingRedirect = searchParams.get('msg') === 'booking' || redirectUrl.includes('tickets') || redirectUrl.includes('checkout');

  const { signUp } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 33;
    if (password.length >= 10) strength += 33;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength += 34;
    return strength;
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service to proceed.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = signUp(firstName, lastName, email, password);
      setLoading(false);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setError(res.message || 'Failed to create account. Please try again.');
      }
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
            <Link
              href={`/signin?redirect=${encodeURIComponent(redirectUrl)}&msg=${isBookingRedirect ? 'booking' : ''}`}
              className="flex-1 py-2 text-xs font-semibold rounded-xl text-[var(--fg-sec)] hover:text-[var(--fg)] transition-all flex items-center justify-center gap-1.5"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-[var(--card)] text-[var(--fg)] shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Ticket size={13} className="text-[var(--fg)]" /> Create Account
            </button>
          </div>

          <p className="text-xs text-[var(--fg-sec)] pt-1">
            {isBookingRedirect
              ? 'Register to proceed with your ticket selection and checkout.'
              : 'Join TicketX for instant ticket transfers, seat maps, & 100% guarantee.'}
          </p>
        </div>

        {/* Booking Guard Alert Banner */}
        <AnimatePresence>
          {isBookingRedirect && (
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
                  Create your account below to finish booking your tickets.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2.5 shadow-sm"
            >
              <AlertCircle size={18} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)]">
                First Name
              </label>
              <div className="relative input-focus-glow rounded-2xl transition-all">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  required
                  className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)]/60 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)]">
                Last Name
              </label>
              <div className="relative input-focus-glow rounded-2xl transition-all">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Morgan"
                  required
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)]/60 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
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
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)]/60 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)]">
              Password
            </label>
            <div className="relative input-focus-glow rounded-2xl transition-all">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)]/60 focus:outline-none transition-all"
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

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-[var(--bg-sec)] rounded-full overflow-hidden border border-[var(--border)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${strength}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-full ${
                      strength > 66 ? 'bg-emerald-500' : strength > 33 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-[var(--fg-sec)] font-medium text-right">
                  {strength > 66 ? 'Strong Password' : strength > 33 ? 'Medium Strength' : 'Weak (Min 6 chars)'}
                </p>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-[var(--border)] text-[var(--fg)] focus:ring-0 accent-[var(--fg)] cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-xs text-[var(--fg-sec)] leading-snug cursor-pointer">
              I agree to the <span className="underline text-[var(--fg)] font-semibold">Terms of Service</span> and{' '}
              <span className="underline text-[var(--fg)] font-semibold">Privacy Policy</span>.
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[var(--bg)] border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <>
                Create Account <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--fg-sec)]">
            Already have a TicketX account?{' '}
            <Link
              href={`/signin?redirect=${encodeURIComponent(redirectUrl)}&msg=${isBookingRedirect ? 'booking' : ''}`}
              className="font-bold text-[var(--fg)] hover:underline transition-colors underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Security Guarantee Badge */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center gap-3">
          <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
          <p className="text-[11px] text-[var(--fg-sec)] leading-tight">
            <strong className="text-[var(--fg)]">100% Buyer Guarantee</strong> — Authentic verified tickets with instant transfer delivery.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <>
      <Header />
      <main className="min-h-[85vh] pt-28 md:pt-32 bg-transparent flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-center py-20 text-sm text-[var(--fg-sec)]">Loading sign up...</div>}>
          <SignUpForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
