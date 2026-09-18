'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DigitalTicket from '@/components/ticketing/DigitalTicket';
import { useBooking } from '@/context/BookingContext';
import Link from 'next/link';
import { CheckCircle2, Ticket, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId;
  const { orders, purchasedTickets } = useBooking();

  const currentOrder = orders.find((o) => o.orderId === orderId) || {
    orderId: orderId || 'TX-998822',
    date: new Date().toISOString(),
    items: [
      {
        id: 'mock-1',
        eventTitle: 'Taylor Swift | The Eras Tour',
        venue: 'SoFi Stadium',
        city: 'Los Angeles',
        date: '2026-10-10',
        time: '7:00 PM',
        sectionName: 'Floor A',
        row: 'Row 1',
        seatNumber: 12,
        price: 180,
      }
    ],
    pricing: { total: 215.90, subtotal: 180, serviceFee: 21.60, processingFee: 4.50, taxes: 9.80 },
  };

  const orderTickets = purchasedTickets.filter((t) => t.orderId === orderId);
  const displayTickets = orderTickets.length > 0 ? orderTickets : currentOrder.items.map((item, i) => ({
    ticketId: `TKT-${88100 + i}`,
    orderId: currentOrder.orderId,
    eventTitle: item.eventTitle,
    venue: item.venue,
    city: item.city,
    date: item.date,
    time: item.time,
    section: item.sectionName || item.section || 'Floor A',
    row: item.row || 'Row 1',
    seat: item.seatNumber || item.seat || `${12 + i}`,
    status: 'CONFIRMED',
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)] pb-16">
        <section className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 space-y-10">
            {/* Confirmation Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] text-center max-w-2xl mx-auto space-y-3 shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">Payment Successful</span>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--fg)] tracking-tight">Order Confirmed!</h1>
              <p className="text-xs text-[var(--fg-sec)]">
                Order Reference: <span className="font-mono font-bold text-[var(--fg)]">{currentOrder.orderId}</span>
              </p>
              <p className="text-xs text-[var(--fg-sec)] max-w-md mx-auto leading-relaxed">
                A receipt and digital pass have been sent to your email. You can access your passes anytime in your TicketX Account.
              </p>
            </motion.div>

            {/* Digital Tickets Carousel/Grid */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-[var(--fg)] tracking-tight text-center">Your Digital Passes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayTickets.map((t) => (
                  <DigitalTicket key={t.ticketId} ticket={t} />
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-[var(--border)]">
              <Link
                href="/account/tickets"
                className="px-6 py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 hover:opacity-90 shadow-md"
              >
                <Ticket size={16} /> View My Tickets
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg)] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-[var(--card)]"
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
