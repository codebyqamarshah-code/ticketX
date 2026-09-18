'use client';

import { QrCode, Download, Share2, Wallet, Check } from 'lucide-react';
import { useState } from 'react';

export default function DigitalTicket({ ticket }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-xl transition-all max-w-md mx-auto">
      {/* Top Header Strip */}
      <div className="bg-[var(--fg)] text-[var(--bg)] p-4 flex items-center justify-between">
        <span className="text-xs font-black tracking-tighter uppercase">TICKETX DIGITAL PASS</span>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[var(--bg)] text-[var(--fg)]">
          {ticket.status || 'CONFIRMED'}
        </span>
      </div>

      {/* Main Ticket Details */}
      <div className="p-6 space-y-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Event</p>
          <h3 className="text-lg font-black text-[var(--fg)] leading-snug">{ticket.eventTitle}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Date & Time</p>
            <p className="font-bold text-[var(--fg)]">{ticket.date}</p>
            <p className="text-[var(--fg-sec)]">{ticket.time}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">Location</p>
            <p className="font-bold text-[var(--fg)]">{ticket.venue}</p>
            <p className="text-[var(--fg-sec)]">{ticket.city}</p>
          </div>
        </div>

        {/* Seat Location Box */}
        <div className="p-4 rounded-2xl bg-[var(--bg-sec)] border border-[var(--border)] grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">SECTION</p>
            <p className="text-sm font-black text-[var(--fg)]">{ticket.section || '101'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">ROW</p>
            <p className="text-sm font-black text-[var(--fg)]">{ticket.row || 'Row 1'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">SEAT</p>
            <p className="text-sm font-black text-[var(--fg)]">{ticket.seat || 'Seat 1'}</p>
          </div>
        </div>

        {/* Visual QR Code Placeholder */}
        <div className="py-6 flex flex-col items-center justify-center border-t border-b border-[var(--border)] border-dashed space-y-2">
          <div className="w-32 h-32 p-3 bg-white rounded-2xl flex items-center justify-center border border-black/10 shadow-inner">
            <QrCode size={100} className="text-black" />
          </div>
          <p className="text-[10px] font-mono text-[var(--fg-sec)] uppercase tracking-wider">
            Pass ID: {ticket.ticketId || 'TKT-99482'}
          </p>
        </div>

        {/* Ticket Actions */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() => alert('Digital ticket downloaded successfully!')}
            className="py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center justify-center gap-1.5"
          >
            <Download size={13} /> Save
          </button>
          <button
            onClick={() => alert('Pass added to Apple/Google Wallet!')}
            className="py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center justify-center gap-1.5"
          >
            <Wallet size={13} /> Wallet
          </button>
          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center justify-center gap-1.5"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />} Share
          </button>
        </div>
      </div>
    </div>
  );
}
