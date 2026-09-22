'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize, ArrowLeft, MapPin, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SeatLegend from './SeatLegend';

export default function VenueSeatMap({
  seatMapData,
  selectedSeatIds = [],
  onSeatToggle,
  activeFilter = {},
  hoveredSeatId = null,
  focusedSeatId = null,
  onSeatHover,
  className = '',
}) {
  const { stage = {}, sections = [], seats = [] } = seatMapData || {};
  const { priceMin = 0, priceMax = Infinity, selectedTypes = [] } = activeFilter || {};

  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [selectedSectionId, setSelectedSectionId] = useState('all');
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [localHoveredSeatId, setLocalHoveredSeatId] = useState(null);
  const [showMinimap, setShowMinimap] = useState(true);

  const containerRef = useRef(null);
  const minimapRef = useRef(null);

  // Viewport bounds in SVG coordinate space
  const SVG_WIDTH = 1100;
  const SVG_HEIGHT = 700;
  const SVG_CENTER_X = 550;
  const SVG_CENTER_Y = 350;

  // Derive active tooltip seat without triggering cascading renders in effect
  const activeTooltipSeat = useMemo(() => {
    const targetId = localHoveredSeatId || hoveredSeatId || focusedSeatId;
    if (!targetId) return null;
    return seats.find((s) => s.id === targetId) || null;
  }, [localHoveredSeatId, hoveredSeatId, focusedSeatId, seats]);

  // Sync focusedSeatId from sidebar ticket item selection
  useEffect(() => {
    if (focusedSeatId) {
      const targetSeat = seats.find((s) => s.id === focusedSeatId);
      if (targetSeat) {
        queueMicrotask(() => {
          setSelectedSectionId(targetSeat.sectionId);
          setZoomLevel(2.2);
          setDragPosition({
            x: -(targetSeat.x - SVG_CENTER_X) * 1.5,
            y: -(targetSeat.y - SVG_CENTER_Y) * 1.5,
          });
        });
      }
    }
  }, [focusedSeatId, seats]);

  // Focal Point Wheel Zoom (Zooms directly into mouse hover location smoothly)
  const handleWheelZoom = useCallback((e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const zoomFactor = -e.deltaY * 0.002;
    const delta = Math.min(Math.max(zoomFactor, -0.35), 0.35);

    setZoomLevel((prevZoom) => {
      const newZoom = Math.min(Math.max(0.7, prevZoom + delta), 3.5);
      if (Math.abs(newZoom - prevZoom) < 0.001) return prevZoom;
      const zoomRatio = newZoom / prevZoom;

      setDragPosition((prevDrag) => ({
        x: mouseX - (mouseX - prevDrag.x) * zoomRatio,
        y: mouseY - (mouseY - prevDrag.y) * zoomRatio,
      }));

      return newZoom;
    });
  }, []);

  // Button Zoom Controls
  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.min(Math.max(0.7, prev + delta), 3.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1.0);
    setSelectedSectionId('all');
    setDragPosition({ x: 0, y: 0 });
    setLocalHoveredSeatId(null);
  };

  const handleFitToVenue = () => {
    setZoomLevel(0.95);
    setSelectedSectionId('all');
    setDragPosition({ x: 0, y: 0 });
  };

  // Section Click Drill-down
  const handleSectionClick = (secId) => {
    if (selectedSectionId === secId) {
      setSelectedSectionId('all');
      setZoomLevel(1.0);
      setDragPosition({ x: 0, y: 0 });
    } else {
      const sec = sections.find((s) => s.id === secId);
      setSelectedSectionId(secId);
      setZoomLevel(2.0);
      if (sec) {
        setDragPosition({
          x: -(sec.x + sec.width / 2 - SVG_CENTER_X) * 1.4,
          y: -(sec.y + sec.height / 2 - SVG_CENTER_Y) * 1.4,
        });
      }
    }
  };

  // Minimap Click Pan
  const handleMinimapClick = (e) => {
    if (!minimapRef.current) return;
    const rect = minimapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetSvgX = (clickX / rect.width) * SVG_WIDTH;
    const targetSvgY = (clickY / rect.height) * SVG_HEIGHT;

    setDragPosition({
      x: -(targetSvgX - SVG_CENTER_X) * zoomLevel,
      y: -(targetSvgY - SVG_CENTER_Y) * zoomLevel,
    });
  };

  // Filter seats based on active sidebar controls
  const isSeatMatchFilter = (seat) => {
    if (selectedSectionId !== 'all' && seat.sectionId !== selectedSectionId) return false;
    if (seat.price < priceMin || seat.price > priceMax) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(seat.ticketType)) return false;
    return true;
  };

  const visibleSeats = seats.filter(isSeatMatchFilter);

  // Progressive Zoom Density Thresholds
  const isOverviewMode = zoomLevel < 1.35;
  const isMediumDetail = zoomLevel >= 1.35 && zoomLevel < 2.1;
  const isHighDetail = zoomLevel >= 2.1;

  // Perfect seat radius math: NEVER overlaps (Spacing is 18px-22px)
  const getSeatRadius = () => {
    if (isOverviewMode) return 2.2;
    if (isMediumDetail) return 3.6;
    return 5.2; // Diameter 10.4px < 18px minimum spacing! Zero collision!
  };

  const seatRadius = getSeatRadius();

  // Minimap Viewport Bounding Box Calculation
  const visibleWidthSvg = SVG_WIDTH / zoomLevel;
  const visibleHeightSvg = SVG_HEIGHT / zoomLevel;
  const viewportCenterX = SVG_CENTER_X - dragPosition.x / zoomLevel;
  const viewportCenterY = SVG_CENTER_Y - dragPosition.y / zoomLevel;
  const viewportBoxX = Math.max(0, Math.min(SVG_WIDTH - visibleWidthSvg, viewportCenterX - visibleWidthSvg / 2));
  const viewportBoxY = Math.max(0, Math.min(SVG_HEIGHT - visibleHeightSvg, viewportCenterY - visibleHeightSvg / 2));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        {/* Section Pills / Return Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full" style={{ scrollbarWidth: 'none' }}>
          {selectedSectionId !== 'all' ? (
            <button
              type="button"
              onClick={() => handleSectionClick('all')}
              className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)] flex items-center gap-1.5 shrink-0 hover:opacity-90 transition-all shadow cursor-pointer"
            >
              <ArrowLeft size={13} /> Return to Stage Overview
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSelectedSectionId('all')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 bg-[var(--fg)] text-[var(--bg)] cursor-pointer"
            >
              All Sections
            </button>
          )}

          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleSectionClick(sec.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                selectedSectionId === sec.id
                  ? 'bg-[var(--fg)] text-[var(--bg)]'
                  : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] border border-[var(--border)]'
              }`}
            >
              {sec.name} {sec.startingPrice ? `($${sec.startingPrice}+)` : ''}
            </button>
          ))}
        </div>

        {/* Zoom & Camera Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            className="w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-xs font-mono font-bold text-[var(--fg-sec)] w-12 text-center select-none">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            className="w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={handleFitToVenue}
            className="w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            title="Fit to Venue"
          >
            <Maximize size={14} />
          </button>
          <button
            type="button"
            onClick={() => setShowMinimap((prev) => !prev)}
            className={`w-8.5 h-8.5 flex items-center justify-center rounded-lg border border-[var(--border)] transition-colors cursor-pointer ${
              showMinimap ? 'bg-[var(--fg)] text-[var(--bg)]' : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)]'
            }`}
            title="Toggle Minimap"
          >
            <Compass size={14} />
          </button>
        </div>
      </div>

      {/* Main Interactive Venue Canvas Viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheelZoom}
        className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-[480px] md:min-h-[580px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing shadow-inner"
      >
        {/* Canvas Helper Badge */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none bg-[var(--bg)]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[var(--border)] text-[10px] font-semibold text-[var(--fg-sec)] flex items-center gap-1.5">
          <MapPin size={12} />
          {isOverviewMode ? 'Click any section to zoom' : 'Hover mouse to zoom into section · Scroll to zoom'}
        </div>

        {/* FLOATING MINIMAP / VENUE OVERVIEW (TOP RIGHT) */}
        <AnimatePresence>
          {showMinimap && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-[var(--bg)]/90 backdrop-blur-md border border-[var(--border)] shadow-2xl space-y-1"
            >
              <div className="flex items-center justify-between gap-2 px-1">
                <span className="text-[9px] font-black uppercase text-[var(--fg)] tracking-wider">Venue Overview</span>
                <span className="text-[8px] font-mono text-[var(--fg-sec)]">{Math.round(zoomLevel * 100)}%</span>
              </div>
              <div
                ref={minimapRef}
                onClick={handleMinimapClick}
                className="relative w-36 h-24 rounded-lg bg-[var(--bg-sec)] border border-[var(--border)] overflow-hidden cursor-crosshair"
              >
                {/* Minimap Mini SVG Representation */}
                <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
                  {/* Mini Stage */}
                  <rect
                    x={stage.x || 40}
                    y={stage.y || 150}
                    width={stage.width || 90}
                    height={stage.height || 380}
                    rx="6"
                    className="fill-[var(--fg)]"
                  />
                  {/* Mini Sections */}
                  {sections.map((sec) => (
                    <path
                      key={`mini-${sec.id}`}
                      d={sec.svgPath}
                      className={
                        sec.isMix
                          ? 'fill-amber-500/50 stroke-amber-500'
                          : selectedSectionId === sec.id
                          ? 'fill-[var(--fg)] stroke-[var(--fg)]'
                          : 'fill-[var(--card)] stroke-[var(--border)]'
                      }
                    />
                  ))}
                  {/* Dynamic Camera Viewport Bounding Box */}
                  <rect
                    x={viewportBoxX}
                    y={viewportBoxY}
                    width={visibleWidthSvg}
                    height={visibleHeightSvg}
                    className="fill-blue-500/20 stroke-blue-500 stroke-[4] rx-1 stroke-dasharray-[6_3]"
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GPU Accelerated Vector Transform Viewport Container */}
        <motion.div
          drag
          dragConstraints={{ left: -700, right: 700, top: -550, bottom: 550 }}
          dragElastic={0.06}
          animate={{ scale: zoomLevel, x: dragPosition.x, y: dragPosition.y }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full origin-center flex items-center justify-center will-change-transform"
        >
          {/* Hardware-Accelerated Vector SVG Canvas (1100px x 700px) */}
          <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-[1100px] h-[700px] overflow-visible select-none">
            <defs>
              <linearGradient id="stageGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* 1. STAGE: Configured Vertically on LEFT side */}
            <g className="stage-group">
              {/* Outer Stage Frame */}
              <rect
                x={stage.x || 40}
                y={stage.y || 150}
                width={stage.width || 90}
                height={stage.height || 380}
                rx="18"
                className="fill-[var(--fg)] stroke-[var(--border)] shadow-2xl"
              />
              {/* Stage Inner Platform */}
              <rect
                x={(stage.x || 40) + 6}
                y={(stage.y || 150) + 6}
                width={(stage.width || 90) - 12}
                height={(stage.height || 380) - 12}
                rx="14"
                className="fill-[var(--card)] stroke-[var(--fg)]/30"
              />
              {/* Stage Spotlight Projection Light Beams */}
              <path
                d={`M ${(stage.x || 40) + (stage.width || 90)} ${(stage.y || 150) + 20} L 450 40 L 450 640 L ${(stage.x || 40) + (stage.width || 90)} ${(stage.y || 150) + (stage.height || 380) - 20} Z`}
                fill="url(#stageGlow)"
                className="pointer-events-none"
              />
              <circle cx={(stage.x || 40) + (stage.width || 90)} cy={(stage.y || 150) + (stage.height || 380) / 2} r="250" className="fill-none stroke-[var(--fg)]/10 stroke-dasharray-[4_4] pointer-events-none" />
              <circle cx={(stage.x || 40) + (stage.width || 90)} cy={(stage.y || 150) + (stage.height || 380) / 2} r="350" className="fill-none stroke-[var(--fg)]/5 stroke-dasharray-[6_6] pointer-events-none" />

              {/* Vertical Stage Label Text */}
              <text
                x={(stage.x || 40) + (stage.width || 90) / 2}
                y={(stage.y || 150) + (stage.height || 380) / 2}
                transform={`rotate(-90, ${(stage.x || 40) + (stage.width || 90) / 2}, ${(stage.y || 150) + (stage.height || 380) / 2})`}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[var(--fg)] text-[11px] font-black uppercase tracking-[0.3em] pointer-events-none"
              >
                STAGE · PERFORMANCE AREA
              </text>
            </g>

            {/* 2. SECTION POLYGONS & LABELS */}
            {sections.map((sec) => {
              const isSecSelected = selectedSectionId === sec.id;
              if (sec.isMix) {
                return (
                  <g key={sec.id} className="mix-booth-group">
                    <rect
                      x={sec.x}
                      y={sec.y}
                      width={sec.width}
                      height={sec.height}
                      rx="8"
                      className="fill-amber-500/10 stroke-amber-500/40 stroke-dashed"
                    />
                    <text
                      x={sec.x + sec.width / 2}
                      y={sec.y + sec.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-amber-500 text-[9px] font-black uppercase tracking-wider"
                    >
                      MIX BOOTH
                    </text>
                  </g>
                );
              }

              return (
                <g key={sec.id} className="cursor-pointer" onClick={() => handleSectionClick(sec.id)}>
                  <path
                    d={sec.svgPath}
                    className={`transition-all duration-200 ${
                      isSecSelected
                        ? 'fill-[var(--fg)]/15 stroke-[var(--fg)] stroke-2'
                        : 'fill-[var(--card)]/80 stroke-[var(--border)] hover:stroke-[var(--fg-sec)] hover:fill-[var(--bg-sec)]'
                    }`}
                  />
                </g>
              );
            })}

            {/* 3. ROW LABELS (Rendered at medium/detailed zoom) */}
            {!isOverviewMode &&
              sections.map((sec) => {
                if (sec.isMix || (selectedSectionId !== 'all' && selectedSectionId !== sec.id)) return null;
                const rows = sec.rowsCount || 5;
                const ySpacing = sec.height / (rows + 1);

                return Array.from({ length: rows }).map((_, rIdx) => {
                  const rowLetter = String.fromCharCode(65 + rIdx);
                  const rowY = sec.y + (rIdx + 1) * ySpacing;
                  return (
                    <text
                      key={`row-lbl-${sec.id}-${rowLetter}`}
                      x={sec.x + 8}
                      y={rowY}
                      textAnchor="start"
                      dominantBaseline="middle"
                      className="fill-[var(--fg-sec)] text-[8px] font-mono font-bold pointer-events-none opacity-60"
                    >
                      {rowLetter}
                    </text>
                  );
                });
              })}

            {/* 4. GPU-ACCELERATED PERFECT ALIGNED SVG SEAT NODES (ZERO COLLISION) */}
            <g className="seats-layer">
              {visibleSeats.map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.id);
                const isHovered =
                  (hoveredSeatId === seat.id || focusedSeatId === seat.id || activeTooltipSeat?.id === seat.id) &&
                  seat.isAvailable;

                let fill = 'var(--card)';
                let stroke = 'var(--border)';
                let strokeWidth = 1;
                let strokeDasharray = 'none';
                let opacity = 1;

                if (!seat.isAvailable) {
                  fill = 'var(--border)';
                  stroke = 'none';
                  opacity = 0.25;
                } else if (isSelected) {
                  fill = 'var(--fg)';
                  stroke = 'var(--bg)';
                  strokeWidth = 2;
                } else if (isHovered) {
                  fill = 'var(--fg)';
                  stroke = 'var(--fg)';
                  strokeWidth = 2;
                } else if (seat.isVIP) {
                  fill = 'var(--card)';
                  stroke = 'var(--fg)';
                  strokeWidth = 1.8;
                } else if (seat.isResale) {
                  fill = 'var(--card)';
                  stroke = 'var(--fg-sec)';
                  strokeDasharray = '2,2';
                } else if (seat.isAccessible) {
                  fill = 'var(--card)';
                  stroke = 'var(--fg-sec)';
                  strokeWidth = 1.5;
                }

                return (
                  <g
                    key={seat.id}
                    className={`seat-node ${seat.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (seat.isAvailable) onSeatToggle(seat);
                    }}
                    onMouseEnter={() => {
                      if (onSeatHover) onSeatHover(seat.id);
                      if (seat.isAvailable) setLocalHoveredSeatId(seat.id);
                    }}
                    onMouseLeave={() => {
                      if (onSeatHover) onSeatHover(null);
                      setLocalHoveredSeatId(null);
                    }}
                  >
                    {/* Hover Pulsing Glow Ring */}
                    {isHovered && seat.isAvailable && (
                      <circle
                        cx={seat.x}
                        cy={seat.y}
                        r={seatRadius + 4}
                        className="fill-none stroke-[var(--fg)] stroke-1 animate-ping opacity-50"
                      />
                    )}

                    {/* Selected Ring */}
                    {isSelected && (
                      <circle
                        cx={seat.x}
                        cy={seat.y}
                        r={seatRadius + 3}
                        className="fill-none stroke-[var(--fg)] stroke-2"
                      />
                    )}

                    {/* Main Seat Circle - Dynamic mathematically non-overlapping radius */}
                    <circle
                      cx={seat.x}
                      cy={seat.y}
                      r={isHovered || isSelected ? seatRadius * 1.25 : seatRadius}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      opacity={opacity}
                      className="transition-all duration-150"
                    />

                    {/* Seat Number Text inside circle when zoomed in */}
                    {isHighDetail && seat.isAvailable && (
                      <text
                        x={seat.x}
                        y={seat.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-[5.5px] font-mono font-bold pointer-events-none select-none ${
                          isSelected || isHovered ? 'fill-[var(--bg)]' : 'fill-[var(--fg)]'
                        }`}
                      >
                        {seat.seatNumber}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* 5. HIGH-CONTRAST SECTION NAME BADGES (Rendered ON TOP of seats so section names are ALWAYS 100% crisp & readable) */}
            <g className="section-labels-layer pointer-events-none">
              {sections.map((sec) => {
                if (sec.isMix) return null;
                const isSecSelected = selectedSectionId === sec.id;
                const labelText = sec.name.toUpperCase();

                const fontPx = isOverviewMode ? 12 : 9;
                const badgeWidth = labelText.length * (fontPx * 0.65) + (isOverviewMode ? 22 : 14);
                const badgeHeight = isOverviewMode ? 26 : 18;
                const badgeX = sec.x + sec.width / 2 - badgeWidth / 2;
                const badgeY = isOverviewMode ? sec.y + sec.height / 2 - badgeHeight / 2 : sec.y + 6;

                return (
                  <g key={`sec-badge-${sec.id}`}>
                    {/* High Contrast Background Pill */}
                    <rect
                      x={badgeX}
                      y={badgeY}
                      width={badgeWidth}
                      height={badgeHeight}
                      rx={badgeHeight / 2}
                      className={
                        isSecSelected
                          ? 'fill-[var(--fg)] stroke-[var(--bg)] stroke-2 shadow-lg'
                          : 'fill-[var(--card)] stroke-[var(--border)] stroke-1 shadow-md'
                      }
                    />
                    {/* Section Name Text */}
                    <text
                      x={sec.x + sec.width / 2}
                      y={badgeY + badgeHeight / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`font-black uppercase tracking-wider select-none ${
                        isSecSelected ? 'fill-[var(--bg)]' : 'fill-[var(--fg)]'
                      } ${isOverviewMode ? 'text-[12px]' : 'text-[9px]'}`}
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </motion.div>

        {/* 5. FLOATING RICH TOOLTIP OVERLAY */}
        {activeTooltipSeat && activeTooltipSeat.isAvailable && (
          <div className="absolute bottom-4 left-4 z-40 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold shadow-2xl border border-white/20 space-y-0.5 animate-in fade-in zoom-in-95 pointer-events-none">
            <div className="flex items-center justify-between gap-4">
              <span className="font-black text-white">{activeTooltipSeat.seatLabel}</span>
              <span className="font-black text-emerald-400">${activeTooltipSeat.price}</span>
            </div>
            <p className="text-white/70 text-[10px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {activeTooltipSeat.ticketType} · Available for Booking
            </p>
          </div>
        )}
      </div>

      {/* Seat Map Legend */}
      <SeatLegend />
    </div>
  );
}
