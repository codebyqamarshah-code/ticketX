'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useBooking } from '@/context/BookingContext';
import { ShoppingBag, ArrowRight, CheckCircle2, Ticket } from 'lucide-react';

export default function OrderHistoryPage() {
  const { orders } = useBooking();

  const defaultMockOrders = [
    {
      orderId: 'TX-882019',
      date: new Date().toISOString(),
      items: [
        { id: '1', eventTitle: 'Taylor Swift | The Eras Tour', price: 180, quantity: 1 },
        { id: '2', eventTitle: 'LA Lakers vs. Boston Celtics', price: 65, quantity: 1 },
      ],
      pricing: { grandTotal: 289.40 },
      status: 'Confirmed',
    },
  ];

  const orderList = orders.length > 0 ? orders : defaultMockOrders;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Order History</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
            View all your past ticket purchases and order receipts
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />

          <div className="flex-1 space-y-4">
            {orderList.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center space-y-3">
                <ShoppingBag size={40} className="mx-auto text-[var(--fg-sec)]" />
                <h3 className="text-base font-bold">No orders found</h3>
                <p className="text-xs text-[var(--fg-sec)]">You haven&apos;t placed any ticket orders yet.</p>
              </div>
            ) : (
              orderList.map((order) => {
                const totalPaid = Number(order.pricing?.grandTotal ?? order.pricing?.total ?? 0);

                return (
                  <div key={order.orderId} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)] text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Order Number</span>
                        <p className="font-mono font-bold text-[var(--fg)] text-sm">{order.orderId}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Order Date</span>
                        <p className="font-semibold text-[var(--fg)]">
                          {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Status</span>
                        <p className="font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 size={12} /> {order.status}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Total Paid</span>
                        <p className="font-black text-[var(--fg)] text-sm">${totalPaid.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--fg)]">{item.eventTitle || 'Event Ticket'}</span>
                          <span className="text-[var(--fg-sec)] font-semibold">${item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link
                        href={`/confirmation/${order.orderId}`}
                        className="text-xs font-bold text-[var(--fg)] hover:underline flex items-center gap-1"
                      >
                        View Digital Receipt <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
