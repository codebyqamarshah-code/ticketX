'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SectionHeader({
  title,
  subtitle,
  href,
  label = 'See All',
  icon: Icon,
  rightAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 ${className}`}>
      {/* Left side: Icon + Title & Subtitle */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        {Icon && (
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] shrink-0 shadow-sm mt-0.5 sm:mt-0">
            <Icon size={18} />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--fg)] tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <div className="text-sm text-[var(--fg-sec)] mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Right side: See All Link + Right Action (e.g. Scroll buttons) */}
      {(href || rightAction) && (
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {href && (
            <Link
              href={href}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors duration-200"
            >
              <span>{label}</span>
              <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
          {rightAction}
        </div>
      )}
    </div>
  );
}

