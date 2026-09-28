'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DigitalTicket from '@/components/ticketing/DigitalTicket';
import { useBooking } from '@/context/BookingContext';
import Link from 'next/link';
import { CheckCircle2, Ticket, Home, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId;
  const { orders, purchasedTickets } = useBooking();

  const currentOrder = orders.find((o) => o.orderId === orderId);

  // Get all tickets belonging to this order
  const orderTickets = purchasedTickets.filter((t) => t.orderId === orderId);

  // Fallback: if no tickets found yet (edge case), show placeholder
  const displayTickets = orderTickets.length > 0
    ? orderTickets
    : currentOrder?.items?.map((item, i) => ({
        ticketId: `TKT-${88100 + i}`,
        orderId: currentOrder.orderId,
        eventTitle: item.eventTitle || 'Live Event',
        category: item.category || 'LIVE EVENT',
        venue: item.venue || 'Venue TBA',
        city: item.city || '',
        date: item.date || 'Upcoming',
        time: item.time || '7:00 PM',
        section: item.sectionName || item.section || 'General',
        row: item.row || 'Row 1',
        seat: String(item.seatNumber || item.seat || `${i + 1}`),
        gate: item.gate || 'Gate A · Main Entrance',
        bookedFrom: 'TicketX Primary Box Office',
        price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price || '$0.00',
        status: 'CONFIRMED',
      })) || [];

  const customerName = currentOrder?.customer
    ? `${currentOrder.customer.firstName} ${currentOrder.customer.lastName}`
    : 'Valued Customer';
  const customerEmail = currentOrder?.customer?.email || '';
  const totalPaid = currentOrder?.pricing?.total
    ? `$${currentOrder.pricing.total.toFixed(2)}`
    : '';
  const bookedAt = currentOrder?.date
    ? new Date(currentOrder.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)] pb-20">
        <section className="py-10">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 space-y-12">

            {/* ── Payment Success Banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative overflow-hidden p-8 md:p-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-[var(--card)] to-[var(--card)] text-center max-w-2xl mx-auto space-y-4 shadow-2xl"
            >
              {/* Animated success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 size={40} className="text-emerald-400" />
              </motion.div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Payment Successful
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-[var(--fg)] tracking-tight mt-1">
                  Booking Confirmed!
                </h1>
              </div>

              {/* Order meta info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-left space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Order Ref</p>
                  <p className="font-mono font-black text-[var(--fg)]">{orderId || 'TX-XXXXXX'}</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-left space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Booked For</p>
                  <p className="font-bold text-[var(--fg)] truncate">{customerName}</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-left space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Total Paid</p>
                  <p className="font-black text-[var(--fg)]">{totalPaid}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--fg-sec)]">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Booked via TicketX Primary Box Office · {bookedAt}</span>
              </div>

              {customerEmail && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--fg-sec)]">
                  <Mail size={13} />
                  <span>Digital passes sent to <strong className="text-[var(--fg)]">{customerEmail}</strong></span>
                </div>
              )}
            </motion.div>

            {/* ── Digital Tickets Section ── */}
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-[var(--fg)] tracking-tight">
                  Your Digital Passes
                </h2>
                <p className="text-xs text-[var(--fg-sec)]">
                  {displayTickets.length} ticket{displayTickets.length !== 1 ? 's' : ''} generated — one per booked seat
                </p>
              </div>

              {displayTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayTickets.map((t, idx) => (
                    <motion.div
                      key={t.ticketId}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.12, duration: 0.45 }}
                    >
                      <DigitalTicket ticket={t} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                  <Ticket size={36} className="mx-auto mb-3 text-[var(--fg-sec)] opacity-30" />
                  <p className="text-sm font-bold text-[var(--fg-sec)]">No tickets found for this order.</p>
                </div>
              )}
            </div>

            {/* ── Action CTAs ── */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[var(--border)]">
              <Link
                href="/account/tickets"
                className="px-6 py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 hover:opacity-90 shadow-md transition-all"
              >
                <Ticket size={16} /> View All My Tickets
              </Link>
              <Link
                href="/account/orders"
                className="px-6 py-3.5 border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg)] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-[var(--card)] transition-all"
              >
                Order History <ArrowRight size={14} />
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg)] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-[var(--card)] transition-all"
              >
                <Home size={16} /> Return to Home
              </Link>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
