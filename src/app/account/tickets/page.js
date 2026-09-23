'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DigitalTicket from '@/components/ticketing/DigitalTicket';
import { useBooking } from '@/context/BookingContext';
import Link from 'next/link';
import { Ticket, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';

export default function MyTicketsPage() {
  const { purchasedTickets } = useBooking();
  const [activeTab, setActiveTab] = useState('upcoming');

  const defaultMockTickets = [
    {
      ticketId: 'TKT-88492',
      orderId: 'TX-882019',
      eventTitle: 'Taylor Swift | The Eras Tour',
      category: 'CONCERT',
      venue: 'SoFi Stadium',
      city: 'Los Angeles, CA',
      date: 'Saturday, Oct 24, 2026',
      time: '7:00 PM',
      section: 'Floor A2',
      row: '5',
      seat: '12',
      gate: 'Gate A · VIP Entrance 1',
      bookedFrom: 'TicketX Primary Box Office',
      price: '$350.00',
      status: 'CONFIRMED',
    },
    {
      ticketId: 'TKT-90231',
      orderId: 'TX-904812',
      eventTitle: 'Los Angeles Lakers vs. Boston Celtics',
      category: 'SPORTS',
      venue: 'Crypto.com Arena',
      city: 'Los Angeles, CA',
      date: 'Sunday, Nov 15, 2026',
      time: '6:30 PM',
      section: '101',
      row: '14',
      seat: '8',
      gate: 'Gate C · Main Plaza',
      bookedFrom: 'TicketX Official Partner',
      price: '$210.00',
      status: 'CONFIRMED',
    },
    {
      ticketId: 'TKT-77184',
      orderId: 'TX-774920',
      eventTitle: 'Coldplay - Music of the Spheres Tour',
      category: 'CONCERT',
      venue: 'Rose Bowl Stadium',
      city: 'Pasadena, CA',
      date: 'Friday, Dec 04, 2026',
      time: '8:00 PM',
      section: 'Field 3',
      row: '22',
      seat: '45',
      gate: 'Gate B · Entrance 4',
      bookedFrom: 'TicketX Box Office',
      price: '$175.00',
      status: 'CONFIRMED',
    },
  ];

  const tickets = purchasedTickets.length > 0 ? purchasedTickets : defaultMockTickets;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)] pb-16">
        <section className="py-12">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-8">
            {/* Account Header Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--fg-sec)]">My Account</span>
                <h1 className="text-2xl md:text-4xl font-black text-[var(--fg)] tracking-tight">My Tickets</h1>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { label: 'My Tickets', href: '/account/tickets', active: true },
                  { label: 'Order History', href: '/account/orders' },
                  { label: 'Favorites', href: '/account/favorites' },
                  { label: 'Watchlist', href: '/account/watchlist' },
                ].map((nav) => (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      nav.active
                        ? 'bg-[var(--fg)] text-[var(--bg)]'
                        : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] border border-[var(--border)]'
                    }`}
                  >
                    {nav.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tickets Grid */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    activeTab === 'upcoming' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-[var(--fg-sec)]'
                  }`}
                >
                  Upcoming ({tickets.length})
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    activeTab === 'past' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-[var(--fg-sec)]'
                  }`}
                >
                  Past Events (0)
                </button>
              </div>

              {activeTab === 'upcoming' && tickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tickets.map((t) => (
                    <DigitalTicket key={t.ticketId} ticket={t} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 max-w-md mx-auto space-y-3">
                  <Ticket size={40} className="mx-auto text-[var(--fg-sec)] opacity-30" />
                  <h3 className="text-base font-bold text-[var(--fg)]">No tickets found</h3>
                  <p className="text-xs text-[var(--fg-sec)]">You don&apos;t have any tickets in this view.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
