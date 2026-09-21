'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Accessibility, Star, RefreshCw } from 'lucide-react';

export default function Seat({ seat, isSelected, isHovered = false, onSelect, zoomLevel = 1.0 }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Status colors matching TicketX monochrome palette
  let bgClass = '';
  if (!seat.isAvailable) {
    bgClass = 'bg-[var(--border)] opacity-30 cursor-not-allowed text-[var(--fg-sec)]';
  } else if (isSelected) {
    bgClass = 'bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)] font-bold shadow-lg ring-2 ring-[var(--fg)] ring-offset-1 scale-125 z-20';
  } else if (isHovered) {
    bgClass = 'bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)] font-bold shadow-md scale-125 z-20';
  } else if (seat.isVIP) {
    bgClass = 'bg-[var(--card)] border-2 border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] font-bold';
  } else if (seat.isResale) {
    bgClass = 'bg-[var(--card)] border-dashed border-2 border-[var(--fg-sec)] text-[var(--fg)] hover:border-[var(--fg)] font-semibold';
  } else if (seat.isAccessible) {
    bgClass = 'bg-[var(--card)] border border-[var(--fg-sec)] text-[var(--fg)] hover:border-[var(--fg)] font-semibold';
  } else {
    bgClass = 'bg-[var(--card)] border border-[var(--border)] text-[var(--fg-sec)] hover:border-[var(--fg-sec)] hover:text-[var(--fg)] font-medium';
  }

  // Progressive Zoom Detail Sizes
  const isHighDetail = zoomLevel >= 1.9;
  const isMediumDetail = zoomLevel >= 1.3 && zoomLevel < 1.9;

  let sizeClass = 'w-2.5 h-2.5 rounded-full'; // Overview tiny dot
  if (isMediumDetail) {
    sizeClass = 'w-4.5 h-4.5 rounded-md text-[8px]';
  } else if (isHighDetail) {
    sizeClass = 'w-6.5 h-6.5 md:w-7 md:h-7 rounded-lg text-[10px]';
  }

  return (
    <div className="relative group">
      <motion.button
        type="button"
        disabled={!seat.isAvailable}
        onClick={() => onSelect(seat)}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        whileHover={{ scale: seat.isAvailable ? 1.3 : 1 }}
        whileTap={{ scale: seat.isAvailable ? 0.9 : 1 }}
        className={`flex items-center justify-center transition-all duration-150 focus:outline-none ${sizeClass} ${bgClass}`}
        aria-label={`${seat.seatLabel}, $${seat.price}, ${seat.isAvailable ? 'available' : 'unavailable'}`}
      >
        {isHighDetail ? (
          <span className="font-mono">{seat.seatNumber}</span>
        ) : isMediumDetail ? (
          seat.isVIP ? <Star size={9} className="fill-current" /> : <span className="font-mono">{seat.seatNumber}</span>
        ) : null}
      </motion.button>

      {/* Rich Floating Tooltip */}
      {(tooltipOpen || isHovered) && seat.isAvailable && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3.5 py-2 rounded-xl bg-black text-white text-[10px] font-semibold whitespace-nowrap shadow-2xl z-50 pointer-events-none border border-white/20 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-3">
            <span className="font-black text-white">{seat.seatLabel}</span>
            <span className="font-black text-emerald-400">${seat.price}</span>
          </div>
          <p className="text-white/70 text-[9px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {seat.ticketType} · Available
          </p>
        </div>
      )}
    </div>
  );
}
