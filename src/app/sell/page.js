'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useBooking } from '@/context/BookingContext';
import { Tag, Ticket, ArrowRight, ShieldCheck, Search, AlertCircle } from 'lucide-react';

export default function SellTicketsPage() {
  const { purchasedTickets } = useBooking();
  const [search, setSearch] = useState('');

  const eligibleTickets = purchasedTickets.filter(
    (t) => t.status === 'Confirmed'
  );

  const filteredTickets = eligibleTickets.filter((t) =>
    t.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
    t.venue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Banner */}
        <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--bg-sec)] p-6 sm:p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[var(--fg)] text-[var(--bg)]">
              Fan-to-Fan Marketplace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">Sell Your Event Tickets</h1>
            <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1 max-w-lg">
              List your authentic tickets easily. Get guaranteed payouts with zero buyer fraud protection.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center shrink-0">
            <Tag size={32} />
          </div>
        </div>

        {/* Step Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black tracking-tight">Select a Ticket to Sell</h2>
            <p className="text-xs text-[var(--fg-sec)] mt-0.5">Choose an active confirmed ticket from your account</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your tickets..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
            />
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center space-y-3">
            <Ticket size={40} className="mx-auto text-[var(--fg-sec)]" />
            <h3 className="text-base font-bold">No eligible tickets found</h3>
            <p className="text-xs text-[var(--fg-sec)] max-w-sm mx-auto">
              You don&apos;t have any unlisted confirmed tickets available for resale at this time.
            </p>
            <Link
              href="/account/tickets"
              className="inline-flex items-center gap-2 mt-2 text-xs font-bold underline"
            >
              View My Tickets Page
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((t) => (
              <div
                key={t.ticketId}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--fg-sec)] transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[var(--fg-sec)] font-bold">{t.ticketId}</span>
                  <h3 className="text-base font-black tracking-tight">{t.eventTitle}</h3>
                  <p className="text-xs text-[var(--fg-sec)]">{t.date} · {t.time}</p>
                  <p className="text-xs text-[var(--fg-sec)]">{t.venue}, {t.city}</p>
                  <div className="pt-1 text-xs">
                    <span className="text-[var(--fg-sec)]">Sec: </span>
                    <span className="font-bold">{t.section}</span>
                    <span className="text-[var(--fg-sec)] ml-2">Row: </span>
                    <span className="font-bold">{t.row}</span>
                    <span className="text-[var(--fg-sec)] ml-2">Seat: </span>
                    <span className="font-bold">{t.seat}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border)]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[var(--fg-sec)] uppercase font-bold block">Purchase Price</span>
                    <span className="text-base font-black">${t.price}</span>
                  </div>
                  <Link
                    href={`/sell/${t.ticketId}`}
                    className="px-5 py-2.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm mt-2"
                  >
                    List For Sale <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-start gap-3 text-xs">
          <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[var(--fg)]">TicketX Guaranteed Seller Payout</p>
            <p className="text-[var(--fg-sec)] text-[11px] mt-0.5">
              When your ticket sells, your funds are deposited directly into your payout method within 24 hours of event completion.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
