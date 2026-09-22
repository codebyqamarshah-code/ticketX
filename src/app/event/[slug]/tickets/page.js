'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VenueSeatMap from '@/components/seat-map/VenueSeatMap';
import HoldTimer from '@/components/seat-map/HoldTimer';
import { getEventBySlug } from '@/data/events';
import { generateEventSeatMap, findBestAvailableSeats } from '@/lib/ticketInventory';
import { useCart } from '@/context/CartContext';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { calculateOrderTotal } from '@/lib/pricing';
import Link from 'next/link';
import {
  ArrowLeft, Ticket, ShoppingBag, ArrowRight, Trash2, SlidersHorizontal, Sparkles, Plus, Minus, Check, MapPin, Tag, Star
} from 'lucide-react';

export default function TicketSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const event = useMemo(() => {
    return (
      getEventBySlug(slug) || {
        id: 'e-default',
        slug: slug || 'event',
        title: 'Taylor Swift | The Eras Tour',
        date: '2026-10-10',
        time: '7:00 PM',
        venue: 'SoFi Stadium',
        city: 'Los Angeles',
        priceFrom: 89,
      }
    );
  }, [slug]);

  // Data-driven seat map inventory with left vertical stage config
  const seatMapData = useMemo(() => generateEventSeatMap(event), [event]);

  // Selections & Filters State
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(600);
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  // Sidebar ↔ Map Synchronization State
  const [hoveredSeatId, setHoveredSeatId] = useState(null);
  const [focusedSeatId, setFocusedSeatId] = useState(null);

  const { addToCart, setDrawerOpen } = useCart();
  const { startHoldTimer, holdActive, holdTimeSeconds, resetHoldTimer } = useBooking();

  // Selected Seat Objects
  const selectedSeats = useMemo(() => {
    return seatMapData.seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seatMapData, selectedSeatIds]);

  // Available Seats matching active filters
  const availableTicketListings = useMemo(() => {
    return seatMapData.seats.filter((s) => {
      if (!s.isAvailable) return false;
      if (s.price < priceMin || s.price > priceMax) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(s.ticketType)) return false;
      return true;
    });
  }, [seatMapData, priceMin, priceMax, selectedTypes]);

  // Real-time Pricing calculation
  const pricing = useMemo(() => {
    return calculateOrderTotal(selectedSeats);
  }, [selectedSeats]);

  // Auto-release seats on hold timer expiration
  useEffect(() => {
    if (holdActive && holdTimeSeconds === 0) {
      queueMicrotask(() => {
        setSelectedSeatIds([]);
        resetHoldTimer();
      });
    }
  }, [holdActive, holdTimeSeconds, resetHoldTimer]);

  // Toggle seat selection
  const handleSeatToggle = (seat) => {
    if (!seat.isAvailable) return;

    if (!holdActive) {
      startHoldTimer();
    }

    setSelectedSeatIds((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  };

  // Sidebar ticket listing click handler
  const handleSidebarTicketClick = (seat) => {
    handleSeatToggle(seat);
    setFocusedSeatId(seat.id);
  };

  // Best Available Auto Selector
  const handleBestAvailable = () => {
    const bestSeatIds = findBestAvailableSeats(seatMapData.seats, ticketQuantity, {
      priceMin,
      priceMax,
      selectedTypes,
    });

    if (bestSeatIds.length > 0) {
      if (!holdActive) startHoldTimer();
      setSelectedSeatIds(bestSeatIds);
      setFocusedSeatId(bestSeatIds[0]);
    }
  };

  // Ticket Type Filter Toggle
  const toggleTicketTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Cart Synchronization
  const handleAddToCart = () => {
    if (selectedSeats.length === 0) return;

    selectedSeats.forEach((seat) => {
      addToCart({
        id: `${event.id}:${seat.id}`,
        eventId: event.id,
        eventTitle: event.title,
        eventSlug: event.slug,
        date: event.date,
        time: event.time,
        venue: event.venue,
        city: event.city,
        sectionName: seat.sectionName,
        row: seat.row,
        seatNumber: seat.seatNumber,
        ticketType: seat.ticketType,
        price: seat.price,
        quantity: 1,
      });
    });

    setSelectedSeatIds([]);
    setDrawerOpen(true);
  };

  const { isAuthenticated } = useAuth();

  // Checkout Handler
  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;
    handleAddToCart();
    if (!isAuthenticated) {
      router.push('/signin?redirect=/checkout&msg=booking');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 md:pt-32 lg:pt-36 bg-[var(--bg)] pb-28 lg:pb-16">
        {/* Header Strip */}
        <section className="py-4 border-b border-[var(--border)] bg-[var(--bg-sec)]">
          <div className="max-w-[1650px] mx-auto px-4 md:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/event/${event.slug}`}
                className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors shadow-sm"
                aria-label="Back to event details"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-black text-[var(--fg)] tracking-tight">{event.title}</h1>
                <p className="text-xs font-semibold text-[var(--fg-sec)]">{event.venue} · {event.city} · {event.date} at {event.time}</p>
              </div>
            </div>

            <HoldTimer />
          </div>
        </section>

        {/* Main Selection Workspace */}
        <section className="py-6">
          <div className="max-w-[1650px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: Interactive Venue Seat Map (7 Cols) */}
              <div className="lg:col-span-7">
                <VenueSeatMap
                  seatMapData={seatMapData}
                  selectedSeatIds={selectedSeatIds}
                  onSeatToggle={handleSeatToggle}
                  activeFilter={{ priceMin, priceMax, selectedTypes }}
                  hoveredSeatId={hoveredSeatId}
                  focusedSeatId={focusedSeatId}
                  onSeatHover={setHoveredSeatId}
                />
              </div>

              {/* RIGHT: Ticket Panel & Synchronized Available Listings (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Ticket Quantity & Filter Controls */}
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <h2 className="text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                      <SlidersHorizontal size={15} /> Filters & Auto-Selection
                    </h2>
                    <button
                      onClick={handleBestAvailable}
                      className="px-3.5 py-1.5 rounded-full bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 shadow transition-all"
                    >
                      <Sparkles size={13} /> Best Available
                    </button>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--fg)]">Ticket Quantity</p>
                      <p className="text-[10px] text-[var(--fg-sec)]">Select up to 8 tickets</p>
                    </div>
                    <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-sec)]">
                      <button
                        type="button"
                        onClick={() => setTicketQuantity((q) => Math.max(1, q - 1))}
                        className="w-8.5 h-8.5 flex items-center justify-center text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center font-mono font-bold text-xs text-[var(--fg)]">
                        {ticketQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTicketQuantity((q) => Math.min(8, q + 1))}
                        className="w-8.5 h-8.5 flex items-center justify-center text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Price Range Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--fg)]">
                      <span>Max Price Filter</span>
                      <span className="font-mono text-[var(--fg-sec)]">${priceMax}</span>
                    </div>
                    <input
                      type="range"
                      min={75}
                      max={600}
                      step={15}
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full accent-[var(--fg)] bg-[var(--bg-sec)] h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Ticket Types Filter Pills */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-[var(--fg)]">Ticket Types</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Standard Ticket', 'VIP Package', 'Accessible Ticket', 'Resale Ticket'].map((type) => {
                        const active = selectedTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleTicketTypeFilter(type)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              active
                                ? 'bg-[var(--fg)] text-[var(--bg)] shadow'
                                : 'bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-[var(--fg)] border border-[var(--border)]'
                            }`}
                          >
                            {active && <Check size={11} />} {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Synchronized Available Ticket Listings Panel */}
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                      <Ticket size={15} /> Available Tickets ({availableTicketListings.length})
                    </h3>
                    <span className="text-[10px] font-bold text-[var(--fg-sec)]">Click to highlight & pick</span>
                  </div>

                  {/* Ticket Listings List */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {availableTicketListings.length > 0 ? (
                      availableTicketListings.slice(0, 15).map((seat) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const isHovered = hoveredSeatId === seat.id;

                        return (
                          <div
                            key={seat.id}
                            onClick={() => handleSidebarTicketClick(seat)}
                            onMouseEnter={() => setHoveredSeatId(seat.id)}
                            onMouseLeave={() => setHoveredSeatId(null)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] shadow'
                                : isHovered
                                ? 'border-[var(--fg-sec)] bg-[var(--bg-sec)]'
                                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--fg-sec)]'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold">{seat.seatLabel}</p>
                              <p className={`text-[10px] ${isSelected ? 'opacity-80' : 'text-[var(--fg-sec)]'}`}>
                                {seat.ticketType}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black">${seat.price}</p>
                              <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-[var(--bg)]' : 'text-emerald-500'}`}>
                                {isSelected ? 'Selected' : 'Available'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-[var(--fg-sec)]">
                        No tickets match the current price & type filters.
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Selected Tickets Summary Box */}
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <h2 className="text-xs font-black uppercase tracking-wider text-[var(--fg)]">
                      Selected Order ({selectedSeats.length})
                    </h2>
                    {selectedSeats.length > 0 && (
                      <button
                        onClick={() => setSelectedSeatIds([])}
                        className="text-xs text-[var(--fg-sec)] hover:text-red-500 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 size={12} /> Clear All
                      </button>
                    )}
                  </div>

                  {/* Selected Seats Listing */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map((seat) => (
                        <div key={seat.id} className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[var(--fg)]">{seat.seatLabel}</p>
                            <p className="text-[10px] text-[var(--fg-sec)]">{seat.ticketType}</p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="text-xs font-black text-[var(--fg)]">${seat.price}</span>
                            <button
                              onClick={() => handleSeatToggle(seat)}
                              className="text-[10px] text-red-500 hover:underline font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-[var(--fg-sec)] space-y-1">
                        <p className="font-bold text-[var(--fg)]">No seats selected</p>
                        <p className="text-[11px] text-[var(--fg-sec)]">
                          Select seats on the venue map or from the available list above.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  {selectedSeats.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-sec)]">
                      <div className="flex justify-between">
                        <span>Subtotal ({selectedSeats.length} tickets)</span>
                        <span className="font-bold text-[var(--fg)]">${pricing.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Fee (12%)</span>
                        <span className="font-bold text-[var(--fg)]">${pricing.serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span className="font-bold text-[var(--fg)]">${pricing.processingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Taxes (8%)</span>
                        <span className="font-bold text-[var(--fg)]">${pricing.taxes.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between pt-3 border-t border-[var(--border)] text-base font-black text-[var(--fg)]">
                        <span>Total Price</span>
                        <span>${pricing.total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      disabled={selectedSeats.length === 0}
                      onClick={handleAddToCart}
                      className="w-full py-3 border border-[var(--fg)] text-[var(--fg)] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[var(--bg-sec)] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>

                    <button
                      disabled={selectedSeats.length === 0}
                      onClick={handleProceedToCheckout}
                      className="w-full py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                      Proceed to Checkout <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Sticky Drawer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-[var(--fg-sec)]">{selectedSeats.length} Seats Selected</p>
            <p className="text-xl font-black text-[var(--fg)]">${pricing.total.toFixed(2)}</p>
          </div>
          <button
            disabled={selectedSeats.length === 0}
            onClick={handleProceedToCheckout}
            className="flex-1 py-3.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-wider rounded-xl text-center disabled:opacity-40 transition-all shadow-md"
          >
            Checkout ({selectedSeats.length})
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
