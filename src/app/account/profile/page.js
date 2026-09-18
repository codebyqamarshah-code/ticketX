'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Globe, CheckCircle2, Camera } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '(555) 234-5678');
  const [city, setCity] = useState(user?.city || 'Los Angeles');
  const [country, setCountry] = useState(user?.country || 'USA');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateProfile({
        firstName,
        lastName,
        email,
        phone,
        city,
        country,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      });
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Profile Settings</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
            Update your personal profile details and contact information
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />

          <div className="flex-1 space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-sm">
              {saved && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Preview */}
                <div className="flex items-center gap-5 border-b border-[var(--border)] pb-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--bg-sec)] shrink-0">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-2xl text-[var(--fg-sec)]">
                        {firstName?.[0] || 'U'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                    />
                    <p className="text-[10px] text-[var(--fg-sec)]">Paste a direct image web link to update your avatar.</p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                      First Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                      City
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                      Country
                    </label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
                  >
                    {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
