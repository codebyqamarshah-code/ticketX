'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Ticket } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, pricing } = useCart();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 md:pt-32 bg-transparent pb-16">
        <section className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-sec)] hover:text-[var(--fg)] mb-2">
                  <ArrowLeft size={14} /> Continue Shopping
                </Link>
                <h1 className="text-2xl md:text-4xl font-black text-[var(--fg)] tracking-tight">Shopping Cart</h1>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[var(--fg-sec)] hover:text-red-500 flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear Cart
                </button>
              )}
            </div>

            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Cart Items List (2 Cols) */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] px-2.5 py-0.5 rounded-full">
                          {item.ticketType || 'Standard'}
                        </span>
                        <h3 className="text-base font-bold text-[var(--fg)] mt-1">{item.eventTitle}</h3>
                        <p className="text-xs text-[var(--fg-sec)]">{item.venue} · {item.city} · {item.date}</p>
                        <p className="text-xs font-mono font-semibold text-[var(--fg-sec)]">
                          {item.sectionName || item.section}, Row {item.row}, Seat {item.seatNumber || item.seat}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                        <span className="text-lg font-black text-[var(--fg)]">${item.price}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-[var(--fg-sec)] hover:text-red-500 font-semibold flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Sidebar (1 Col) */}
                <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-6 shadow-lg">
                  <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] pb-4 border-b border-[var(--border)]">
                    Order Summary
                  </h2>

                  <div className="space-y-2.5 text-xs text-[var(--fg-sec)]">
                    <div className="flex justify-between">
                      <span>Tickets Subtotal</span>
                      <span className="font-bold text-[var(--fg)]">${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee (12%)</span>
                      <span className="font-bold text-[var(--fg)]">${pricing.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee</span>
                      <span className="font-bold text-[var(--fg)]">${pricing.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Taxes (8%)</span>
                      <span className="font-bold text-[var(--fg)]">${pricing.taxes.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-[var(--border)] text-base font-black text-[var(--fg)]">
                      <span>Total Amount</span>
                      <span>${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full py-4 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl text-center hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 max-w-md mx-auto space-y-4">
                <Ticket size={48} className="mx-auto text-[var(--fg-sec)] opacity-30" />
                <h2 className="text-lg font-bold text-[var(--fg)]">Your cart is currently empty</h2>
                <p className="text-xs text-[var(--fg-sec)]">Browse our event discovery catalog and select your tickets.</p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90"
                >
                  Explore Events <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
