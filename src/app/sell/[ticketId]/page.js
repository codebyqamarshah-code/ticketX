'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useBooking } from '@/context/BookingContext';
import { useNotifications } from '@/context/NotificationContext';
import { Tag, ArrowLeft, CheckCircle2, ShieldCheck, DollarSign, Calculator, Info } from 'lucide-react';

export default function ResaleCreatePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const ticketId = params?.ticketId;

  const { purchasedTickets, listTicketForResale } = useBooking();
  const { createNotification } = useNotifications();

  const ticket = purchasedTickets.find((t) => t.ticketId === ticketId) || purchasedTickets[0];

  const [resalePrice, setResalePrice] = useState(ticket ? ticket.price : 200);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <Header />
        <main className="flex-1 pt-32 pb-16 text-center px-4">
          <Tag size={48} className="mx-auto text-[var(--fg-sec)] mb-3" />
          <h1 className="text-2xl font-black">Ticket Not Found</h1>
          <p className="text-xs text-[var(--fg-sec)] mt-1">Unable to locate the ticket for resale listing.</p>
          <Link href="/sell" className="inline-block mt-4 text-xs font-bold underline">
            Return to Sell Page
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const numericPrice = Number(resalePrice) || 0;
  const sellerFee = Math.round(numericPrice * 0.1);
  const estimatedPayout = Math.max(0, numericPrice - sellerFee);

  const handlePublishListing = (e) => {
    e.preventDefault();
    if (numericPrice <= 0) return;

    setLoading(true);
    setTimeout(() => {
      listTicketForResale(ticket.ticketId, numericPrice);
      createNotification(
        'Resale Listing Published',
        `Your ticket for ${ticket.eventTitle} is now live on the TicketX Marketplace at $${numericPrice}.`,
        'Orders'
      );
      setLoading(false);
      setPublished(true);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-2xl mx-auto w-full">
        {/* Back link */}
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Choose Another Ticket
        </Link>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
          {published ? (
            /* Published State */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Listing Published Live!</h2>
              <p className="text-xs text-[var(--fg-sec)] max-w-md mx-auto">
                Your ticket for <strong className="text-[var(--fg)]">{ticket.eventTitle}</strong> is now visible to thousands of event-goers on TicketX.
              </p>

              <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Ticket ID:</span>
                  <span className="font-mono font-bold">{ticket.ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Listing Price:</span>
                  <span className="font-bold">${numericPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Estimated Net Payout:</span>
                  <span className="font-black text-emerald-500">${estimatedPayout}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <Link
                  href="/account/resale"
                  className="px-6 py-2.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  Manage Resale Listings
                </Link>
              </div>
            </div>
          ) : (
            /* Create Form */
            <form onSubmit={handlePublishListing} className="space-y-6">
              {/* Event Header */}
              <div className="border-b border-[var(--border)] pb-4">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg-sec)]">
                  Resale Pricing Calculator
                </span>
                <h1 className="text-xl font-black tracking-tight mt-2">{ticket.eventTitle}</h1>
                <p className="text-xs text-[var(--fg-sec)] mt-0.5">{ticket.date} · {ticket.time}</p>
                <p className="text-xs text-[var(--fg-sec)]">{ticket.venue}, {ticket.city}</p>
              </div>

              {/* Ticket Details summary */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-xs flex items-center justify-between">
                <div>
                  <span className="text-[var(--fg-sec)]">Seat Location: </span>
                  <span className="font-bold">Sec {ticket.section}, Row {ticket.row}, Seat {ticket.seat}</span>
                </div>
                <div>
                  <span className="text-[var(--fg-sec)]">Original Price: </span>
                  <span className="font-bold">${ticket.price}</span>
                </div>
              </div>

              {/* Price Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">
                  Set Your Resale Price Per Ticket ($)
                </label>

                <div className="relative">
                  <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg)]" />
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={resalePrice}
                    onChange={(e) => setResalePrice(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xl font-black text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                  />
                </div>
                <p className="text-[11px] text-[var(--fg-sec)] flex items-center gap-1">
                  <Info size={13} /> Suggested market range for this section: ${Math.round(ticket.price * 0.8)} - ${Math.round(ticket.price * 1.5)}
                </p>
              </div>

              {/* Payout Breakdown */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-[var(--fg-sec)]">Listing Price:</span>
                  <span className="font-black text-sm">${numericPrice}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--fg-sec)]">
                  <span>TicketX Seller Fee (10%):</span>
                  <span>-${sellerFee}</span>
                </div>
                <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center">
                  <span className="font-bold">Estimated Payout to You:</span>
                  <span className="text-lg font-black text-emerald-500">${estimatedPayout}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || numericPrice <= 0}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? 'Publishing Listing...' : 'Publish Resale Listing'}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-[var(--fg-sec)] justify-center">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>You can edit or cancel this listing anytime before it sells.</span>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
