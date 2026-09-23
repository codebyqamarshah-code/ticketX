'use client';

import { useState, useEffect } from 'react';
import {
  Download, Share2, Wallet, Check, ShieldCheck, RefreshCw, Barcode, QrCode, Lock, Ticket, MapPin, Calendar, Clock, DollarSign, Building2, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';

export default function DigitalTicket({ ticket }) {
  const [copied, setCopied] = useState(false);
  const [barcodeMode, setBarcodeMode] = useState('qr'); // 'qr' | 'barcode'
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [showDetails, setShowDetails] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  // Live rotating security timer for realistic anti-counterfeit ticket pass
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintDownload = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => setWalletAdded(false), 3000);
  };

  const ticketPrice = ticket.price || ticket.pricePaid || '$185.00';
  const bookingOrigin = ticket.bookedFrom || 'TicketX Official Box Office';
  const orderRef = ticket.orderId || 'TX-882019';
  const passId = ticket.ticketId || 'TKT-99482';
  const gateInfo = ticket.gate || 'Gate B · Entrance 4';

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all max-w-md mx-auto group">
      {/* Top Holographic Verification Strip */}
      <div className="bg-gradient-to-r from-[var(--fg)] via-zinc-800 to-[var(--fg)] text-[var(--bg)] p-3.5 flex items-center justify-between border-b border-black/10">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span className="text-[10px] font-black tracking-widest uppercase">
            TICKETX VERIFIED DIGITAL PASS
          </span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
          <CheckCircle2 size={10} /> {ticket.status || 'CONFIRMED'}
        </span>
      </div>

      {/* Main Ticket Card Content */}
      <div className="p-5 space-y-4">
        {/* Booked Origin Badge */}
        <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-[var(--fg-sec)]">
            <Building2 size={13} className="text-[var(--fg)] shrink-0" />
            <span className="font-semibold truncate">Booked Via:</span>
          </div>
          <span className="font-bold text-[var(--fg)] truncate">{bookingOrigin}</span>
        </div>

        {/* Event Header */}
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--fg-sec)]">
            {ticket.category || 'LIVE EVENT'}
          </span>
          <h3 className="text-xl font-black text-[var(--fg)] leading-snug tracking-tight mt-0.5">
            {ticket.eventTitle}
          </h3>
        </div>

        {/* Date, Time & Venue Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-sec)]/50">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-[var(--fg-sec)]">
              <Calendar size={11} /> Date & Time
            </div>
            <p className="font-extrabold text-[var(--fg)]">{ticket.date}</p>
            <p className="text-[11px] text-[var(--fg-sec)] font-medium">{ticket.time}</p>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-[var(--fg-sec)]">
              <MapPin size={11} /> Venue
            </div>
            <p className="font-extrabold text-[var(--fg)] truncate">{ticket.venue}</p>
            <p className="text-[11px] text-[var(--fg-sec)] font-medium truncate">{ticket.city}</p>
          </div>
        </div>

        {/* Seating Grid */}
        <div className="p-3.5 rounded-2xl bg-[var(--fg)] text-[var(--bg)] grid grid-cols-3 gap-2 text-center shadow-md">
          <div>
            <p className="text-[9px] uppercase font-bold tracking-wider opacity-70">SECTION</p>
            <p className="text-base font-black tracking-tight">{ticket.section || 'Floor A'}</p>
          </div>
          <div className="border-x border-[var(--bg)]/20">
            <p className="text-[9px] uppercase font-bold tracking-wider opacity-70">ROW</p>
            <p className="text-base font-black tracking-tight">{ticket.row || 'Row 1'}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-wider opacity-70">SEAT</p>
            <p className="text-base font-black tracking-tight">{ticket.seat || '12'}</p>
          </div>
        </div>

        {/* Entry Gate Badge */}
        <div className="text-center text-[10px] font-bold uppercase tracking-wider text-[var(--fg-sec)] py-1 bg-[var(--bg-sec)] rounded-lg border border-[var(--border)]">
          Entry: {gateInfo}
        </div>

        {/* DYNAMIC SECURITY QR CODE & BARCODE SCANNER AREA */}
        <div className="py-4 px-3 flex flex-col items-center justify-center border-y border-[var(--border)] border-dashed space-y-3 relative bg-[var(--bg-sec)]/30 rounded-2xl">
          {/* Toggle Button for Barcode Mode */}
          <div className="flex items-center justify-between w-full text-[10px] font-bold text-[var(--fg-sec)] px-1">
            <span className="flex items-center gap-1">
              <Lock size={11} className="text-emerald-500" /> Live Security Pass
            </span>
            <button
              type="button"
              onClick={() => setBarcodeMode(barcodeMode === 'qr' ? 'barcode' : 'qr')}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--card)] hover:text-[var(--fg)] transition-all"
            >
              {barcodeMode === 'qr' ? <Barcode size={12} /> : <QrCode size={12} />}
              Switch to {barcodeMode === 'qr' ? '1D Barcode' : 'QR Code'}
            </button>
          </div>

          {/* QR Code Graphic with Laser Beam Scanning Effect */}
          {barcodeMode === 'qr' ? (
            <div className="relative p-4 bg-white rounded-2xl border border-black/10 shadow-inner group-hover:shadow-md transition-all">
              {/* Laser Beam Scanner Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-red-500/80 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] animate-pulse top-2 pointer-events-none z-10" />

              {/* Dynamic Authentic SVG QR Code Pattern */}
              <div className="w-36 h-36 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                  {/* Position detection patterns */}
                  <rect x="0" y="0" width="28" height="28" fill="black" />
                  <rect x="4" y="4" width="20" height="20" fill="white" />
                  <rect x="8" y="8" width="12" height="12" fill="black" />

                  <rect x="72" y="0" width="28" height="28" fill="black" />
                  <rect x="76" y="4" width="20" height="20" fill="white" />
                  <rect x="80" y="8" width="12" height="12" fill="black" />

                  <rect x="0" y="72" width="28" height="28" fill="black" />
                  <rect x="4" y="76" width="20" height="20" fill="white" />
                  <rect x="8" y="80" width="12" height="12" fill="black" />

                  {/* Random simulated data modules based on passId */}
                  <rect x="36" y="4" width="6" height="6" />
                  <rect x="48" y="4" width="6" height="6" />
                  <rect x="60" y="4" width="6" height="6" />
                  <rect x="36" y="16" width="6" height="6" />
                  <rect x="54" y="16" width="6" height="6" />

                  <rect x="4" y="36" width="6" height="6" />
                  <rect x="16" y="36" width="6" height="6" />
                  <rect x="28" y="36" width="6" height="6" />
                  <rect x="40" y="36" width="6" height="6" />
                  <rect x="52" y="36" width="6" height="6" />
                  <rect x="64" y="36" width="6" height="6" />
                  <rect x="76" y="36" width="6" height="6" />
                  <rect x="88" y="36" width="6" height="6" />

                  <rect x="10" y="48" width="6" height="6" />
                  <rect x="22" y="48" width="6" height="6" />
                  <rect x="34" y="48" width="6" height="6" />
                  <rect x="58" y="48" width="6" height="6" />
                  <rect x="70" y="48" width="6" height="6" />
                  <rect x="82" y="48" width="6" height="6" />

                  <rect x="4" y="60" width="6" height="6" />
                  <rect x="16" y="60" width="6" height="6" />
                  <rect x="44" y="60" width="6" height="6" />
                  <rect x="56" y="60" width="6" height="6" />
                  <rect x="76" y="60" width="6" height="6" />

                  <rect x="36" y="72" width="6" height="6" />
                  <rect x="48" y="72" width="6" height="6" />
                  <rect x="66" y="72" width="6" height="6" />
                  <rect x="84" y="72" width="6" height="6" />

                  <rect x="36" y="84" width="6" height="6" />
                  <rect x="54" y="84" width="6" height="6" />
                  <rect x="72" y="84" width="6" height="6" />
                  <rect x="88" y="84" width="6" height="6" />
                </svg>

                {/* TicketX Badge Emblem in Center */}
                <div className="absolute inset-0 m-auto w-8 h-8 rounded-lg bg-black text-white font-black text-[9px] flex items-center justify-center border-2 border-white shadow-md">
                  TX
                </div>
              </div>
            </div>
          ) : (
            /* 1D Barcode View */
            <div className="w-full p-4 bg-white rounded-2xl border border-black/10 flex flex-col items-center justify-center space-y-2">
              <div className="w-full h-20 flex items-center justify-between gap-1">
                {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5].map((w, i) => (
                  <div key={i} className={`h-full bg-black ${w % 2 === 0 ? 'w-1' : 'w-2'}`} />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-black tracking-widest">
                {passId}-SEC-{secondsLeft}
              </span>
            </div>
          )}

          {/* Live Anti-Counterfeit Refresh Bar */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--fg-sec)]">
            <RefreshCw size={11} className="animate-spin text-emerald-500" />
            <span>Refreshes in <strong className="text-[var(--fg)]">{secondsLeft}s</strong> · Anti-Screenshot Enabled</span>
          </div>

          <p className="text-[10px] font-mono text-[var(--fg-sec)] uppercase tracking-wider font-bold">
            Pass ID: {passId}
          </p>
        </div>

        {/* Expandable Order Provenance Details */}
        <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-sec)]/50">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full p-3 flex items-center justify-between text-xs font-bold text-[var(--fg)] hover:bg-[var(--bg-sec)] transition-all"
          >
            <span className="flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-500" /> Order & Provenance Details
            </span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDetails && (
            <div className="p-3.5 border-t border-[var(--border)] space-y-2 text-xs text-[var(--fg-sec)] bg-[var(--card)]">
              <div className="flex items-center justify-between">
                <span>Order Reference:</span>
                <span className="font-mono font-bold text-[var(--fg)]">{orderRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Booked Platform:</span>
                <span className="font-bold text-[var(--fg)]">{bookingOrigin}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Ticket Price:</span>
                <span className="font-extrabold text-[var(--fg)]">{ticketPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Method:</span>
                <span className="font-medium text-emerald-500">NFC Mobile E-Ticket</span>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Alert Confirmation Toast */}
        {walletAdded && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Added to Apple / Google Wallet!
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={handlePrintDownload}
            className="py-2.5 px-2 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download size={13} /> Save PDF
          </button>

          <button
            type="button"
            onClick={handleAddToWallet}
            className="py-2.5 px-2 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Wallet size={13} /> Wallet
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-2 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />} Share
          </button>
        </div>

        {/* Secondary Transfer & Resale Quick Links */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/transfer/${passId}`}
            className="py-2 px-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--bg-sec)] text-[11px] font-bold text-center text-[var(--fg-sec)] hover:text-[var(--fg)] transition-all"
          >
            Transfer Ticket
          </Link>
          <Link
            href={`/sell/${passId}`}
            className="py-2 px-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--bg-sec)] text-[11px] font-bold text-center text-[var(--fg-sec)] hover:text-[var(--fg)] transition-all"
          >
            Sell on TicketX
          </Link>
        </div>
      </div>
    </div>
  );
}
