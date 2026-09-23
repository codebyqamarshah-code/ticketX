'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Globe, CheckCircle2, Camera, Trash2, Upload } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Lahore');
  const [country, setCountry] = useState(user?.country || 'Pakistan');
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        avatar: avatar || null,
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
            Update your personal profile details, profile picture, and contact information
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
                {/* Avatar Preview & Upload */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-[var(--border)] pb-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--fg)] text-[var(--bg)] shrink-0 flex items-center justify-center shadow-md">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="Profile Avatar"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="font-black text-2xl uppercase leading-none">
                        {firstName?.[0] || 'U'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 flex-1">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]">Profile Picture</h4>
                      <p className="text-[11px] text-[var(--fg-sec)] mt-0.5">
                        {avatar ? 'Custom profile photo active' : 'No photo uploaded. Using initial badge avatar.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[var(--fg)] text-[var(--bg)] text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
                      >
                        <Upload size={14} /> Upload Custom Photo
                      </button>

                      {avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3.5 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Trash2 size={14} /> Remove Photo
                        </button>
                      )}
                    </div>
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
