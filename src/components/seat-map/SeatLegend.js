'use client';

import { Star, Accessibility, RefreshCw } from 'lucide-react';

export default function SeatLegend() {
  const items = [
    { label: 'Available', badge: <span className="w-3.5 h-3.5 rounded bg-[var(--card)] border border-[var(--border)]" /> },
    { label: 'Selected', badge: <span className="w-3.5 h-3.5 rounded bg-[var(--fg)] border border-[var(--fg)]" /> },
    { label: 'Unavailable / Sold', badge: <span className="w-3.5 h-3.5 rounded bg-[var(--border)] opacity-40" /> },
    { label: 'VIP Package', badge: <span className="w-3.5 h-3.5 rounded bg-[var(--card)] border-2 border-[var(--fg)] flex items-center justify-center text-[var(--fg)]"><Star size={8} className="fill-current" /></span> },
    { label: 'Resale Ticket', badge: <span className="w-3.5 h-3.5 rounded bg-[var(--card)] border border-dashed border-[var(--fg-sec)] flex items-center justify-center text-[var(--fg-sec)]"><RefreshCw size={8} /></span> },
    { label: 'ADA Accessible', badge: <span className="w-3.5 h-3.5 rounded bg-[var(--card)] border border-[var(--fg-sec)] flex items-center justify-center text-[var(--fg-sec)]"><Accessibility size={8} /></span> },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-semibold text-[var(--fg-sec)]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.badge}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
