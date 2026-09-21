/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Send, ShieldCheck, Ticket, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { events } from '@/data/events';

export default function TicketTransferPage() {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [transferred, setTransferred] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setTransferred(true);
  };

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[var(--bg)] pt-8 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto py-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-6">
              <Send size={14} className="text-[var(--fg)]" />
              <span>Instant Ticket Transfer</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--fg)] tracking-tight">
              Transfer Mobile Tickets
            </h1>
            <p className="mt-3 text-sm text-[var(--fg-sec)]">
              Send tickets directly to friends or family with 100% secure barcode verification.
            </p>
          </div>

          {transferred ? (
            <div className="max-w-xl mx-auto p-8 md:p-12 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center shadow-xl shadow-black/5">
              <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">Transfer Sent Successfully!</h2>
              <p className="text-sm text-[var(--fg-sec)] mb-6 leading-relaxed">
                Your ticket for <strong>{selectedEvent.title}</strong> has been transferred to <strong>{recipient}</strong>. They will receive an email notification with instructions to accept the transfer.
              </p>
              <div className="p-4 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] text-left mb-6 text-xs text-[var(--fg-sec)] space-y-1">
                <p><strong>Transfer Reference:</strong> TRX-8849204</p>
                <p><strong>Event:</strong> {selectedEvent.title} ({selectedEvent.date})</p>
                <p><strong>Recipient:</strong> {recipient}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setTransferred(false); setRecipient(''); setNote(''); }}
                  className="flex-1 py-3 border border-[var(--border)] text-[var(--fg)] font-semibold text-xs rounded-xl hover:bg-[var(--bg-sec)]"
                >
                  Transfer Another Ticket
                </button>
                <Link
                  href="/account/tickets"
                  className="flex-1 py-3 bg-[var(--fg)] text-[var(--bg)] font-bold text-xs rounded-xl text-center hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  View My Tickets <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left 2 Cols: Form */}
              <div className="lg:col-span-2 p-8 md:p-10 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-lg shadow-black/5">
                <h2 className="text-xl font-bold text-[var(--fg)] mb-6 flex items-center gap-2">
                  <Ticket size={20} /> Select Ticket & Recipient
                </h2>

                <form onSubmit={handleTransferSubmit} className="space-y-6">

                  {/* Ticket Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                      Choose Event Ticket to Transfer *
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                    >
                      {events.slice(0, 6).map((evt) => (
                        <option key={evt.id} value={evt.id}>
                          {evt.title} — {evt.date} ({evt.venue})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recipient Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                      Recipient Email or Mobile Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="friend@example.com or +1 (555) 000-0000"
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)]"
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                      Personal Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Hey! Here is your ticket for the show on Saturday..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Confirm & Send Ticket <Send size={16} />
                  </button>
                </form>
              </div>

              {/* Right 1 Col: Event Summary */}
              <div className="p-6 rounded-3xl bg-[var(--bg-sec)] border border-[var(--border)] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-4">
                    Transfer Preview
                  </h3>

                  <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-[var(--card)]">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="text-lg font-bold text-[var(--fg)] mb-1">{selectedEvent.title}</h4>
                  <p className="text-xs text-[var(--fg-sec)] mb-3">{selectedEvent.venue} • {selectedEvent.city}</p>

                  <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs space-y-1.5 text-[var(--fg-sec)] mb-4">
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span className="font-semibold text-[var(--fg)]">{selectedEvent.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Section:</span>
                      <span className="font-semibold text-[var(--fg)]">Orchestra Center</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seat:</span>
                      <span className="font-semibold text-[var(--fg)]">Row C, Seat 12</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[var(--fg-sec)] border-t border-[var(--border)] pt-4">
                  <ShieldCheck size={14} className="text-[var(--fg)] shrink-0" />
                  <span>100% Guaranteed Transfer via Verified Barcode Protocol.</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
