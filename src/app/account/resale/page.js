'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useBooking } from '@/context/BookingContext';
import { useNotifications } from '@/context/NotificationContext';
import { Tag, Plus, XCircle, ArrowRight, DollarSign, CheckCircle2, Ticket } from 'lucide-react';

export default function ResaleListingsPage() {
  const { purchasedTickets, cancelResaleListing } = useBooking();
  const { createNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'sold' | 'all'

  const resaleTickets = purchasedTickets.filter(
    (t) => t.status === 'Listed for Resale' || t.status === 'Sold'
  );

  const filteredTickets = resaleTickets.filter((t) => {
    if (activeTab === 'active') return t.status === 'Listed for Resale';
    if (activeTab === 'sold') return t.status === 'Sold';
    return true;
  });

  const handleCancelListing = (ticketId, eventTitle) => {
    cancelResaleListing(ticketId);
    createNotification(
      'Listing Cancelled',
      `Your resale listing for ${eventTitle} (${ticketId}) has been cancelled. Ticket returned to active status.`,
      'System'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Resale Listings</h1>
            <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
              Manage your verified fan-to-fan resale ticket listings
            </p>
          </div>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm shrink-0"
          >
            <Plus size={16} /> List New Ticket
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />

          <div className="flex-1 space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              {[
                { id: 'active', label: 'Active Listings' },
                { id: 'sold', label: 'Sold Listings' },
                { id: 'all', label: 'All Listings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--fg)] text-[var(--bg)]'
                      : 'text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            {filteredTickets.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
                <Tag size={40} className="mx-auto text-[var(--fg-sec)] mb-3" />
                <h3 className="text-base font-bold">No resale listings found</h3>
                <p className="text-xs text-[var(--fg-sec)] max-w-sm mx-auto mt-1">
                  {activeTab === 'active'
                    ? 'You currently have no active tickets listed for resale on TicketX.'
                    : 'No past sold listings recorded.'}
                </p>
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider"
                >
                  List a Ticket for Sale
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTickets.map((t) => {
                  const resalePrice = t.resalePrice || t.price;
                  const fee = Math.round(resalePrice * 0.1);
                  const payout = resalePrice - fee;

                  return (
                    <div
                      key={t.ticketId}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 relative"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              t.status === 'Sold'
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}
                          >
                            {t.status}
                          </span>
                          <h3 className="text-base font-black tracking-tight mt-2 line-clamp-1">
                            {t.eventTitle}
                          </h3>
                          <p className="text-xs text-[var(--fg-sec)] mt-0.5">{t.date} · {t.time}</p>
                          <p className="text-xs text-[var(--fg-sec)]">{t.venue}, {t.city}</p>
                        </div>
                      </div>

                      {/* Ticket Spec */}
                      <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-xs grid grid-cols-3 text-center">
                        <div>
                          <span className="text-[var(--fg-sec)] text-[10px] uppercase font-bold block">Section</span>
                          <span className="font-black text-sm">{t.section}</span>
                        </div>
                        <div>
                          <span className="text-[var(--fg-sec)] text-[10px] uppercase font-bold block">Row</span>
                          <span className="font-black text-sm">{t.row}</span>
                        </div>
                        <div>
                          <span className="text-[var(--fg-sec)] text-[10px] uppercase font-bold block">Seat</span>
                          <span className="font-black text-sm">{t.seat}</span>
                        </div>
                      </div>

                      {/* Resale Price & Payout Breakdown */}
                      <div className="space-y-1.5 text-xs pt-1">
                        <div className="flex justify-between">
                          <span className="text-[var(--fg-sec)]">Listing Price:</span>
                          <span className="font-bold">${resalePrice}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-[var(--fg-sec)]">
                          <span>Seller Fee (10%):</span>
                          <span>-${fee}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-[var(--border)] font-bold">
                          <span>Your Est. Payout:</span>
                          <span className="text-emerald-500 font-black">${payout}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {t.status === 'Listed for Resale' && (
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleCancelListing(t.ticketId, t.eventTitle)}
                            className="w-full py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <XCircle size={14} /> Cancel Resale Listing
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
