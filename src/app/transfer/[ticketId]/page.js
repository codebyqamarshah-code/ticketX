'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useBooking } from '@/context/BookingContext';
import { useNotifications } from '@/context/NotificationContext';
import { Send, ArrowLeft, CheckCircle2, ShieldAlert, Ticket, Mail, User, Phone, AlertCircle } from 'lucide-react';

export default function TicketTransferPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const ticketId = params?.ticketId;

  const { purchasedTickets, transferTicket } = useBooking();
  const { createNotification } = useNotifications();

  const ticket = purchasedTickets.find((t) => t.ticketId === ticketId) || purchasedTickets[0];

  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [note, setNote] = useState('');

  const [step, setStep] = useState(1); // 1: Form, 2: Review, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <Header />
        <main className="flex-1 pt-32 pb-16 text-center px-4">
          <Ticket size={48} className="mx-auto text-[var(--fg-sec)] mb-3" />
          <h1 className="text-2xl font-black">Ticket Not Found</h1>
          <p className="text-xs text-[var(--fg-sec)] mt-1">The requested ticket ID does not exist in your account.</p>
          <Link href="/account/tickets" className="inline-block mt-4 text-xs font-bold underline">
            Return to My Tickets
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleNextToReview = (e) => {
    e.preventDefault();
    setError('');
    if (!recipientFirstName || !recipientEmail) {
      setError('Please provide at least a recipient name and valid email.');
      return;
    }
    setStep(2);
  };

  const handleConfirmTransfer = () => {
    setLoading(true);
    setTimeout(() => {
      const recipientName = `${recipientFirstName} ${recipientLastName}`.trim();
      transferTicket(ticket.ticketId, recipientName, recipientEmail);
      createNotification(
        'Ticket Transferred',
        `You transferred ticket (${ticket.ticketId}) for ${ticket.eventTitle} to ${recipientName}.`,
        'Orders'
      );
      setLoading(false);
      setStep(3);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-2xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/account/tickets"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Tickets
        </Link>

        {/* Transfer Header Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl mb-6">
          <div className="flex items-start justify-between border-b border-[var(--border)] pb-4 mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg-sec)]">
                Ticket Transfer
              </span>
              <h1 className="text-xl font-black tracking-tight mt-2">{ticket.eventTitle}</h1>
              <p className="text-xs text-[var(--fg-sec)] mt-0.5">{ticket.date} · {ticket.time}</p>
              <p className="text-xs text-[var(--fg-sec)]">{ticket.venue}, {ticket.city}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold block">{ticket.ticketId}</span>
              <span className="text-[11px] font-bold text-[var(--fg-sec)] block mt-1">
                Sec {ticket.section}, Row {ticket.row}, Seat {ticket.seat}
              </span>
            </div>
          </div>

          {ticket.status === 'Transferred' || step === 3 ? (
            /* STEP 3: Transfer Success */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Transfer Complete!</h2>
              <p className="text-xs text-[var(--fg-sec)] max-w-md mx-auto">
                We sent an instant claim invitation email to{' '}
                <strong className="text-[var(--fg)]">
                  {ticket.transferredTo?.email || recipientEmail || 'the recipient'}
                </strong>
                . Once accepted, ownership will transfer immediately.
              </p>

              <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] max-w-md mx-auto text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Recipient:</span>
                  <span className="font-bold">{ticket.transferredTo?.name || `${recipientFirstName} ${recipientLastName}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Recipient Email:</span>
                  <span className="font-bold">{ticket.transferredTo?.email || recipientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Transfer Date:</span>
                  <span className="font-bold">Just now</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 justify-center">
                <Link
                  href="/account/tickets"
                  className="px-6 py-2.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  Return to My Tickets
                </Link>
              </div>
            </div>
          ) : step === 1 ? (
            /* STEP 1: Recipient Form */
            <form onSubmit={handleNextToReview} className="space-y-4">
              <h3 className="text-sm font-black tracking-tight">Step 1 of 2: Enter Recipient Details</h3>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                    First Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                    <input
                      type="text"
                      value={recipientFirstName}
                      onChange={(e) => setRecipientFirstName(e.target.value)}
                      placeholder="Jordan"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={recipientLastName}
                    onChange={(e) => setRecipientLastName(e.target.value)}
                    placeholder="Smith"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                  Recipient Email *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="jordan.smith@example.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                  Recipient Mobile Phone (Optional)
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-sec)]" />
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-1.5">
                  Add Personal Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enjoy the show!"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg)] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Review Transfer Details <Send size={16} />
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Transfer Review */
            <div className="space-y-4">
              <h3 className="text-sm font-black tracking-tight">Step 2 of 2: Confirm Ticket Transfer</h3>

              <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Recipient:</span>
                  <span className="font-bold">{recipientFirstName} {recipientLastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-sec)]">Email:</span>
                  <span className="font-bold">{recipientEmail}</span>
                </div>
                {recipientPhone && (
                  <div className="flex justify-between">
                    <span className="text-[var(--fg-sec)]">Phone:</span>
                    <span className="font-bold">{recipientPhone}</span>
                  </div>
                )}
                {note && (
                  <div className="pt-2 border-t border-[var(--border)]">
                    <span className="text-[var(--fg-sec)] block mb-0.5">Note:</span>
                    <p className="italic text-[var(--fg)]">&quot;{note}&quot;</p>
                  </div>
                )}
              </div>

              {/* Security Alert */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert size={16} />
                  <span>Important Transfer Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Once confirmed, the ticket barcode in your account will be invalidated and transferred to the recipient.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold hover:bg-[var(--card)]"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTransfer}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? 'Transferring Ticket...' : 'Confirm & Send Ticket'}
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
