'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Seat from './Seat';
import SeatLegend from './SeatLegend';

export default function VenueSeatMap({
  seatMapData,
  selectedSeatIds = [],
  onSeatToggle,
  className = '',
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedSection, setSelectedSection] = useState('all');

  const { sections = [], seats = [] } = seatMapData;

  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.min(Math.max(0.8, prev + delta), 1.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setSelectedSection('all');
  };

  const visibleSeats = seats.filter((seat) => {
    if (selectedSection !== 'all' && seat.sectionId !== selectedSection) return false;
    return true;
  });

  // Group seats by Section
  const groupedSections = sections.map((sec) => ({
    ...sec,
    seats: visibleSeats.filter((s) => s.sectionId === sec.id),
  })).filter((sec) => sec.seats.length > 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full" style={{ scrollbarWidth: 'none' }}>
          <button
            type="button"
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
              selectedSection === 'all'
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] border border-[var(--border)]'
            }`}
          >
            All Sections
          </button>
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                selectedSection === sec.id
                  ? 'bg-[var(--fg)] text-[var(--bg)]'
                  : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] border border-[var(--border)]'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => handleZoom(-0.15)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold text-[var(--fg-sec)] w-12 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(0.15)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors"
            aria-label="Reset zoom"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Stage Banner */}
      <div className="relative py-4 text-center rounded-2xl border border-[var(--border)] bg-[var(--bg-sec)] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[var(--fg)]" />
        <span className="relative text-xs font-black uppercase tracking-[0.3em] text-[var(--fg)]">
          STAGE / PERFORMANCE AREA
        </span>
      </div>

      {/* Interactive Seat Grid Container */}
      <div className="relative p-6 md:p-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-auto min-h-[380px] flex justify-center">
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="space-y-8 origin-top transition-all"
        >
          {groupedSections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--fg)]">{sec.name}</span>
                <span className="text-[10px] uppercase font-bold text-[var(--fg-sec)]">({sec.category})</span>
              </div>

              {/* Rows layout */}
              <div className="grid grid-cols-8 gap-2 md:gap-3">
                {sec.seats.map((seat) => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeatIds.includes(seat.id)}
                    onSelect={onSeatToggle}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Seat Legend */}
      <SeatLegend />
    </div>
  );
}
