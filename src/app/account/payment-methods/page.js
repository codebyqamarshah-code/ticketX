'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { CreditCard, Plus, Trash2, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState([
    { id: 'card-1', brand: 'Visa', last4: '4242', exp: '12/28', isDefault: true, name: 'Alex Morgan' },
    { id: 'card-2', brand: 'Mastercard', last4: '8888', exp: '08/27', isDefault: false, name: 'Alex Morgan' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardNumber || !exp) return;

    const newCard = {
      id: `card-${Date.now()}`,
      brand: cardNumber.startsWith('3') ? 'Amex' : cardNumber.startsWith('5') ? 'Mastercard' : 'Visa',
      last4: cardNumber.slice(-4) || '9999',
      exp: exp || '12/29',
      isDefault: cards.length === 0,
      name: cardName || 'Alex Morgan',
    };

    setCards([...cards, newCard]);
    setShowAddForm(false);
    setCardName('');
    setCardNumber('');
    setExp('');
    setCvv('');
  };

  const handleSetDefault = (id) => {
    setCards(cards.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const handleDelete = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Payment Methods</h1>
            <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
              Manage your saved cards for fast and secure checkout
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm shrink-0"
          >
            <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add New Card'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />

          <div className="flex-1 space-y-6">
            {/* Add Card Form Modal / Box */}
            {showAddForm && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl space-y-4">
                <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                  <CreditCard size={18} /> Add Payment Card
                </h3>

                <form onSubmit={handleAddCard} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Alex Morgan"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8888"
                      maxLength={19}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] font-mono focus:outline-none focus:border-[var(--fg)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) => setExp(e.target.value)}
                        placeholder="12/28"
                        maxLength={5}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] font-mono focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1">
                        CVV Code
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] font-mono focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] font-bold text-xs uppercase tracking-wider"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Saved Cards */}
            {cards.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center text-xs text-[var(--fg-sec)]">
                No saved payment methods. Click &quot;Add New Card&quot; to save one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 relative shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center text-[var(--fg)]">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight">{c.brand}</p>
                          <p className="text-xs font-mono text-[var(--fg-sec)]">•••• •••• •••• {c.last4}</p>
                        </div>
                      </div>

                      {c.isDefault ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(c.id)}
                          className="text-[10px] font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] underline"
                        >
                          Make Default
                        </button>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--fg-sec)]">
                      <span>Cardholder: <strong className="text-[var(--fg)]">{c.name}</strong></span>
                      <span>Expires: <strong className="text-[var(--fg)] font-mono">{c.exp}</strong></span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-xs font-bold text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} /> Remove Card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center gap-3 text-xs text-[var(--fg-sec)]">
              <Lock size={18} className="text-emerald-500 shrink-0" />
              <span>
                All payment transactions are encrypted using 256-bit SSL security. Your full card numbers are never stored on our servers.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
