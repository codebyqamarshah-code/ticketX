'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SectionHeader({ title, subtitle, href, label = 'See All', icon: Icon, className = '' }) {
  return (
    <div className={`flex items-end justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-sec)] border border-[var(--border)]">
            <Icon size={16} className="text-[var(--fg)]" />
          </div>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--fg)] tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-[var(--fg-sec)] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors duration-200 shrink-0"
        >
          {label}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
