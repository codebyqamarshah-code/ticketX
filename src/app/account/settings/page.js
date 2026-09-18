'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { Settings, Bell, DollarSign, Globe, CheckCircle2 } from 'lucide-react';

export default function AccountSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English (US)');

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Account Preferences</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
            Customize your notification preferences, currency, and language settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />

          <div className="flex-1 space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-6 shadow-sm">
              {saved && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Preferences saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                {/* Notification Preferences */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2 border-b border-[var(--border)] pb-3">
                    <Bell size={18} /> Communication & Alert Settings
                  </h3>

                  {[
                    { id: 'emailAlerts', label: 'Order Confirmation Emails', desc: 'Receive instant ticket delivery and order receipts.', val: emailAlerts, set: setEmailAlerts },
                    { id: 'smsAlerts', label: 'SMS Ticket Delivery & Reminders', desc: 'Get text reminders on event day and mobile entry barcodes.', val: smsAlerts, set: setSmsAlerts },
                    { id: 'priceDropAlerts', label: 'Watchlist Price Drop Alerts', desc: 'Be notified when saved artists or teams have lower price tickets.', val: priceDropAlerts, set: setPriceDropAlerts },
                    { id: 'marketingEmails', label: 'Promotional Offers & Newsletters', desc: 'Receive weekly curated event recommendations and presale codes.', val: marketingEmails, set: setMarketingEmails },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-1">
                      <div>
                        <p className="text-xs font-bold text-[var(--fg)]">{item.label}</p>
                        <p className="text-[11px] text-[var(--fg-sec)] mt-0.5">{item.desc}</p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={item.val}
                          onChange={(e) => item.set(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--fg)]"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Regional & Currency Preferences */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2 border-b border-[var(--border)] pb-3">
                    <Globe size={18} /> Regional & Currency
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                        Display Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] font-bold focus:outline-none focus:border-[var(--fg)]"
                      >
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="CAD">CAD ($) - Canadian Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                        Preferred Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] font-bold focus:outline-none focus:border-[var(--fg)]"
                      >
                        <option value="English (US)">English (US)</option>
                        <option value="Spanish">Español</option>
                        <option value="French">Français</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
                  >
                    Save Preferences
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
