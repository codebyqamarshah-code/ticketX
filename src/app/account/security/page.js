'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { Shield, Lock, Smartphone, CheckCircle2, Laptop, LogOut } from 'lucide-react';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  const [passwordMsg, setPasswordMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPasswordMsg('');

    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Security & Authentication</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
            Manage your account password, 2FA security, and active sessions
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />

          <div className="flex-1 space-y-6">
            {/* Change Password Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <Lock size={18} /> Update Password
              </h3>

              {passwordMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    passwordMsg.includes('successfully')
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}
                >
                  {passwordMsg}
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[var(--fg)] text-[var(--bg)] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                    <Smartphone size={18} /> Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-[var(--fg-sec)]">
                    Secure your account with SMS or Authenticator App verification codes.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--fg)]"></div>
                </label>
              </div>

              {twoFactor && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                  2FA Protection is enabled. You will receive an SMS code on login.
                </div>
              )}
            </div>

            {/* Active Sessions */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <Laptop size={18} /> Active Login Sessions
              </h3>

              <div className="space-y-3 divide-y divide-[var(--border)]">
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop size={20} className="text-[var(--fg-sec)]" />
                    <div>
                      <p className="text-xs font-bold">Chrome on Windows (This Device)</p>
                      <p className="text-[10px] text-[var(--fg-sec)]">Los Angeles, CA · Active now</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Current Session
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-[var(--fg-sec)]" />
                    <div>
                      <p className="text-xs font-bold">TicketX Mobile App (iOS)</p>
                      <p className="text-[10px] text-[var(--fg-sec)]">Los Angeles, CA · 2 days ago</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-red-500 hover:underline">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
