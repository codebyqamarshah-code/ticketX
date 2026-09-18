'use client';

import { useBooking } from '@/context/BookingContext';
import { Clock } from 'lucide-react';

export default function HoldTimer({ className = '' }) {
  const { formattedHoldTimer, holdActive, holdTimeSeconds } = useBooking();

  if (!holdActive) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold text-[var(--fg)] ${
        holdTimeSeconds < 120 ? 'animate-pulse border-[var(--fg)]' : ''
      } ${className}`}
    >
      <Clock size={14} className="text-[var(--fg-sec)]" />
      <span>Tickets held for <span className="font-mono text-sm font-black">{formattedHoldTimer}</span></span>
    </div>
  );
}
