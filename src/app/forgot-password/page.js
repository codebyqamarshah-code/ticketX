'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Mail, CheckCircle2, KeyRound, Lock, Eye, EyeOff, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import OtpInput from '@/components/ui/OtpInput';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'new-password' | 'done'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Step 1: Request reset OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your account email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess(data.message || 'Verification code sent to your email.');
        setResendCooldown(60);
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send verification code.');
        if (data.message && data.message.includes('seconds')) {
          const match = data.message.match(/\d+/);
          if (match) setResendCooldown(parseInt(match[0], 10));
        }
      }
    } catch (_) {
      setLoading(false);
      setError('Network error. Please try again.');
    }
  };

  // Step 2: Verify reset OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length < 6) {
      setError('Please enter all 6 digits of the recovery code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess('Code verified! Enter your new password.');
        setStep('new-password');
      } else {
        setError(data.message || 'Invalid verification code.');
      }
    } catch (_) {
      setLoading(false);
      setError('Network error. Please try again.');
    }
  };

  // Step 3: Set new password
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/;
    if (!specialCharRegex.test(newPassword)) {
      setError('Password must contain at least one special character (!@#$%^&* etc.).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess(data.message || 'Password updated successfully!');
        setStep('done');
      } else {
        setError(data.message || 'Failed to update password.');
      }
    } catch (_) {
      setLoading(false);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white mx-auto flex items-center justify-center mb-3 shadow-lg shadow-rose-600/20">
                <KeyRound size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                {step === 'otp'
                  ? 'Verify Security Code'
                  : step === 'new-password'
                  ? 'Set New Password'
                  : step === 'done'
                  ? 'Password Reset Complete'
                  : 'Reset Password'}
              </h1>
              <p className="text-xs text-[var(--fg-sec)] mt-1">
                {step === 'otp'
                  ? `Enter the 6-digit code sent to ${email}`
                  : step === 'new-password'
                  ? 'Create a secure new password for your account'
                  : step === 'done'
                  ? 'Your password has been successfully updated'
                  : 'Enter your account email to receive a verification code'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && step !== 'done' && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
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
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || resendCooldown > 0}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : resendCooldown > 0 ? (
                    <span>Wait {resendCooldown}s</span>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
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

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="py-2">
                  <OtpInput
                    value={otp}
                    onChange={(val) => {
                      setOtp(val);
                      setError('');
                    }}
                    length={6}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>

                <div className="text-center text-xs flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={loading || resendCooldown > 0}
                    onClick={handleRequestOtp}
                    className="text-[var(--fg-sec)] hover:text-rose-600 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                  <span className="text-[var(--border)]">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep('email');
                    }}
                    className="text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={12} /> Change Email
                  </button>
                </div>
              </form>
            )}

            {step === 'new-password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)]">
                      New Password
                    </label>
                    <span className="text-[10px] text-[var(--fg-sec)]">Min. 8 chars & 1 symbol</span>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600 transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-rose-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px]">
                    <span className={`inline-flex items-center gap-1 ${newPassword.length >= 8 ? 'text-emerald-500 font-medium' : 'text-[var(--fg-sec)]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
                      8+ chars
                    </span>
                    <span className={`inline-flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/.test(newPassword) ? 'text-emerald-500 font-medium' : 'text-[var(--fg-sec)]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/.test(newPassword) ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
                      1 symbol
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600 transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-rose-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="mt-1 text-[11px]">
                      {newPassword === confirmPassword ? (
                        <span className="text-emerald-500 font-medium">✓ Passwords match</span>
                      ) : (
                        <span className="text-rose-500 font-medium">✗ Passwords do not match</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'done' && (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2 justify-center">
                  <CheckCircle2 size={18} />
                  <span>Password updated successfully!</span>
                </div>
                <p className="text-xs text-[var(--fg-sec)]">
                  You can now log in to your account with your new credentials.
                </p>
                <div className="pt-2">
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 shadow-lg shadow-rose-600/20"
                  >
                    Go to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
