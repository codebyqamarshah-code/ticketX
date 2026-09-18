'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, clearCart, pricing, drawerOpen, setDrawerOpen } = useCart();

  if (!drawerOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.28 }}
          className="w-full max-w-md h-full bg-[var(--bg)] p-6 overflow-y-auto flex flex-col justify-between shadow-2xl border-l border-[var(--border)]"
        >
          {/* Top Bar */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--fg)]" />
                <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)]">Your Cart ({cart.length})</h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-[var(--bg-sec)]"
                aria-label="Close cart"
              >
                <X size={20} className="text-[var(--fg)]" />
              </button>
            </div>

            {/* Cart Items */}
            {cart.length > 0 ? (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--fg)] line-clamp-1">{item.eventTitle}</h4>
                        <p className="text-[11px] text-[var(--fg-sec)]">{item.venue} · {item.date}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[var(--fg-sec)] hover:text-red-500 p-1 transition-colors"
                        aria-label="Remove ticket"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
                      <div>
                        <span className="font-semibold text-[var(--fg)]">{item.sectionName || item.section}</span>
                        <span className="text-[var(--fg-sec)] font-mono ml-2">{item.row}, Seat {item.seatNumber || item.seat}</span>
                      </div>
                      <span className="font-black text-[var(--fg)]">${item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-[var(--fg-sec)] space-y-3">
                <ShoppingBag size={32} className="mx-auto opacity-30" />
                <p className="font-semibold">Your ticket cart is empty.</p>
              </div>
            )}
          </div>

          {/* Pricing & Checkout Footer */}
          {cart.length > 0 && (
            <div className="pt-6 border-t border-[var(--border)] space-y-4">
              <div className="space-y-1.5 text-xs text-[var(--fg-sec)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                  <span>Taxes (8%)</span>
                  <span className="font-bold text-[var(--fg)]">${pricing.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--border)] text-sm font-black text-[var(--fg)]">
                  <span>Total</span>
                  <span>${pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl text-center flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
                >
                  Checkout Now <ArrowRight size={14} />
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-[11px] text-[var(--fg-sec)] hover:text-[var(--fg)] font-semibold text-center"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
