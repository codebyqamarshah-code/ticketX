'use client';

export default function SeatLegend() {
  const items = [
    { label: 'Available', dot: 'bg-[var(--card)] border border-[var(--border)]' },
    { label: 'Selected', dot: 'bg-[var(--fg)] border border-[var(--fg)]' },
    { label: 'Unavailable', dot: 'bg-[var(--border)] opacity-40' },
    { label: 'VIP Package', dot: 'bg-[var(--card)] border border-[var(--fg)]' },
    { label: 'Resale Ticket', dot: 'bg-[var(--card)] border border-dashed border-[var(--fg-sec)]' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-semibold text-[var(--fg-sec)]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded ${item.dot}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
