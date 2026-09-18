'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Seat({ seat, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);

  // Status colors adhering strictly to TicketX monochrome palette
  let bgClass = 'bg-[var(--bg-sec)] border-[var(--border)] text-[var(--fg-sec)]';
  if (!seat.isAvailable) {
    bgClass = 'bg-[var(--border)] opacity-30 cursor-not-allowed';
  } else if (isSelected) {
    bgClass = 'bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)] font-bold shadow-md scale-110';
  } else if (seat.isVIP) {
    bgClass = 'bg-[var(--card)] border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]';
  } else if (seat.isResale) {
    bgClass = 'bg-[var(--card)] border-dashed border-[var(--fg-sec)] text-[var(--fg)] hover:border-[var(--fg)]';
  } else {
    bgClass = 'bg-[var(--card)] border-[var(--border)] text-[var(--fg-sec)] hover:border-[var(--fg-sec)] hover:text-[var(--fg)]';
  }

  return (
    <div className="relative group">
      <motion.button
        type="button"
        disabled={!seat.isAvailable}
        onClick={() => onSelect(seat)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: seat.isAvailable ? 1.2 : 1 }}
        whileTap={{ scale: seat.isAvailable ? 0.9 : 1 }}
        className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border text-[10px] flex items-center justify-center transition-all duration-150 focus:outline-none ${bgClass}`}
        aria-label={`${seat.seatLabel}, $${seat.price}, ${seat.isAvailable ? 'available' : 'unavailable'}`}
      >
        {seat.seatNumber}
      </motion.button>

      {/* Hover Tooltip */}
      {hovered && seat.isAvailable && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-black text-white text-[10px] font-semibold whitespace-nowrap shadow-xl z-30 pointer-events-none border border-white/20">
          <p className="font-bold">{seat.seatLabel}</p>
          <p className="text-white/70">{seat.ticketType} · ${seat.price}</p>
        </div>
      )}
    </div>
  );
}
