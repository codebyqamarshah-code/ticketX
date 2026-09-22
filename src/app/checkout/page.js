'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { cart, pricing, clearCart } = useCart();
  const { createOrder } = useBooking();

  const [step, setStep] = useState(1); // 1: Contact/Billing, 2: Payment, 3: Review
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: 'USA',
    address: '',
    city: user?.city || '',
    state: '',
    postalCode: '',
    cardName: user ? `${user.firstName} ${user.lastName}` : '',
    cardNumber: '',
    cardExp: '',
    cardCvv: '',
  });

  // Redirect to Sign In if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin?redirect=/checkout&msg=booking');
    }
  }, [loading, isAuthenticated, router]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city) {
        setErrorMsg('Please fill in all required contact and billing fields.');
        return;
      }
      setErrorMsg('');
      setStep(2);
    } else if (step === 2) {
      if (!form.cardName || !form.cardNumber) {
        setErrorMsg('Please fill in valid payment details for demo processing.');
        return;
      }
      setErrorMsg('');
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setErrorMsg('');

    // Simulate payment processing delay
    setTimeout(() => {
      try {
        const orderId = createOrder(
          cart,
          { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
          { cardMask: `•••• ${form.cardNumber.slice(-4) || '4242'}` },
          pricing
        );

        clearCart();
        setProcessing(false);
        router.push(`/confirmation/${orderId}`);
      } catch (err) {
        setProcessing(false);
        setErrorMsg('Payment processing failed. Please try again.');
      }
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 bg-[var(--bg)] flex items-center justify-center p-4">
          <div className="text-center max-w-md p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">
            <h1 className="text-2xl font-black text-[var(--fg)]">Your cart is empty</h1>
            <p className="text-xs text-[var(--fg-sec)]">Select tickets before accessing checkout.</p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-xl"
            >
              Browse Events
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[var(--bg)] pb-16">
        <section className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="mb-8">
              <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-sec)] hover:text-[var(--fg)] mb-2">
                <ArrowLeft size={14} /> Back to Cart
              </Link>
              <h1 className="text-2xl md:text-4xl font-black text-[var(--fg)] tracking-tight">Checkout</h1>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center justify-between max-w-xl mx-auto mb-10 pb-4 border-b border-[var(--border)]">
              {[
                { num: 1, label: 'Billing' },
                { num: 2, label: 'Payment' },
                { num: 3, label: 'Review' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    step >= s.num ? 'bg-[var(--fg)] text-[var(--bg)]' : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] border border-[var(--border)]'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-xs font-semibold ${step >= s.num ? 'text-[var(--fg)]' : 'text-[var(--fg-sec)]'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {errorMsg && (
              <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-semibold text-red-500 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Form Column (2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* STEP 1: Contact & Billing */}
                {step === 1 && (
                  <form onSubmit={handleNextStep} className="p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-6">
                    <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] pb-4 border-b border-[var(--border)]">
                      1. Contact & Billing Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          placeholder="John"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Doe"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="john.doe@example.com"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="(555) 000-0000"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-[var(--border)]">
                      <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder="123 Main St, Apt 4B"
                        className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          required
                          placeholder="Los Angeles"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">State</label>
                        <input
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          placeholder="CA"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={form.postalCode}
                          onChange={handleChange}
                          placeholder="90001"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      Continue to Payment <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* STEP 2: Simulated Payment */}
                {step === 2 && (
                  <form onSubmit={handleNextStep} className="p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                      <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)]">
                        2. Simulated Payment Method
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-sec)] flex items-center gap-1">
                        <Lock size={12} /> Safe Demo Mode
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-xs text-[var(--fg-sec)] flex items-center gap-3">
                      <CreditCard size={20} className="text-[var(--fg)] shrink-0" />
                      <p>Demo Mode: No real payment required. You can enter any mock card details to simulate checkout.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Name on Card *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={form.cardName}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Card Number *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={form.cardNumber}
                          onChange={handleChange}
                          required
                          placeholder="4242 •••• •••• 4242"
                          className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            name="cardExp"
                            value={form.cardExp}
                            onChange={handleChange}
                            placeholder="12/28"
                            className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[var(--fg-sec)] uppercase">CVV</label>
                          <input
                            type="password"
                            name="cardCvv"
                            value={form.cardCvv}
                            onChange={handleChange}
                            maxLength={4}
                            placeholder="123"
                            className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="py-3.5 px-6 border border-[var(--border)] text-[var(--fg)] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[var(--bg-sec)]"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        Review Order <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: Order Review */}
                {step === 3 && (
                  <div className="p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-6">
                    <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] pb-4 border-b border-[var(--border)]">
                      3. Final Order Review
                    </h2>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Customer Details</p>
                          <p className="text-xs font-bold text-[var(--fg)]">{form.firstName} {form.lastName}</p>
                          <p className="text-xs text-[var(--fg-sec)]">{form.email} · {form.phone}</p>
                          <p className="text-xs text-[var(--fg-sec)] mt-1">{form.address}, {form.city}, {form.state}</p>
                        </div>
                        <button onClick={() => setStep(1)} className="text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)]">Edit</button>
                      </div>

                      <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Payment Method</p>
                          <p className="text-xs font-bold text-[var(--fg)]">{form.cardName}</p>
                          <p className="text-xs text-[var(--fg-sec)] font-mono">Card ending in •••• {form.cardNumber.slice(-4) || '4242'}</p>
                        </div>
                        <button onClick={() => setStep(2)} className="text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)]">Edit</button>
                      </div>
                    </div>

                    <button
                      disabled={processing}
                      onClick={handlePlaceOrder}
                      className="w-full py-4 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                      {processing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Processing Order...
                        </>
                      ) : (
                        'PLACE ORDER NOW'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-6 shadow-lg">
                <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)] pb-4 border-b border-[var(--border)]">
                  Tickets Summary ({cart.length})
                </h2>

                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-xs">
                      <p className="font-bold text-[var(--fg)]">{item.eventTitle}</p>
                      <p className="text-[11px] text-[var(--fg-sec)]">{item.sectionName || item.section}, Row {item.row}, Seat {item.seatNumber || item.seat}</p>
                      <p className="font-black text-[var(--fg)] mt-1">${item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-[var(--border)] text-xs text-[var(--fg-sec)]">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-[var(--fg)]">${pricing.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Service Fee</span><span className="font-bold text-[var(--fg)]">${pricing.serviceFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Processing Fee</span><span className="font-bold text-[var(--fg)]">${pricing.processingFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Taxes</span><span className="font-bold text-[var(--fg)]">${pricing.taxes.toFixed(2)}</span></div>
                  <div className="flex justify-between pt-3 border-t border-[var(--border)] text-base font-black text-[var(--fg)]">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
