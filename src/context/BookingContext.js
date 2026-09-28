'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const BookingContext = createContext();

const SAMPLE_TICKETS = [
  {
    ticketId: 'TKT-88492',
    orderId: 'TX-492018',
    eventTitle: 'Taylor Swift | The Eras Tour',
    eventSlug: 'taylor-swift-eras-tour',
    date: 'Saturday, Oct 24, 2026',
    time: '7:00 PM',
    venue: 'SoFi Stadium',
    city: 'Los Angeles, CA',
    section: 'Floor A2',
    row: '5',
    seat: '12',
    ticketType: 'VIP Floor Access',
    price: 350,
    status: 'Confirmed',
  },
  {
    ticketId: 'TKT-90231',
    orderId: 'TX-492018',
    eventTitle: 'Los Angeles Lakers vs. Boston Celtics',
    eventSlug: 'lakers-vs-celtics',
    date: 'Sunday, Nov 15, 2026',
    time: '6:30 PM',
    venue: 'Crypto.com Arena',
    city: 'Los Angeles, CA',
    section: '101',
    row: '14',
    seat: '8',
    ticketType: 'Lower Bowl Standard',
    price: 185,
    status: 'Confirmed',
  },
  {
    ticketId: 'TKT-77104',
    orderId: 'TX-102948',
    eventTitle: 'Coldplay - Music of the Spheres Tour',
    eventSlug: 'coldplay-spheres-tour',
    date: 'Friday, Dec 04, 2026',
    time: '8:00 PM',
    venue: 'Rose Bowl Stadium',
    city: 'Pasadena, CA',
    section: 'Field 3',
    row: '22',
    seat: '45',
    ticketType: 'General Admission',
    price: 140,
    status: 'Confirmed',
  },
];

const SAMPLE_ORDERS = [
  {
    orderId: 'TX-492018',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: { firstName: 'Alex', lastName: 'Morgan', email: 'alex.morgan@example.com' },
    payment: { cardBrand: 'Visa', last4: '4242' },
    pricing: { subtotal: 535, serviceFee: 78.5, facilityFee: 15, grandTotal: 628.5 },
    items: [
      { eventTitle: 'Taylor Swift | The Eras Tour', price: 350, sectionName: 'Floor A2', row: '5', seatNumber: '12' },
      { eventTitle: 'Los Angeles Lakers vs. Boston Celtics', price: 185, sectionName: '101', row: '14', seatNumber: '8' },
    ],
    status: 'Confirmed',
  },
  {
    orderId: 'TX-102948',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    customer: { firstName: 'Alex', lastName: 'Morgan', email: 'alex.morgan@example.com' },
    payment: { cardBrand: 'Mastercard', last4: '8888' },
    pricing: { subtotal: 140, serviceFee: 21, facilityFee: 5, grandTotal: 166 },
    items: [
      { eventTitle: 'Coldplay - Music of the Spheres Tour', price: 140, sectionName: 'Field 3', row: '22', seatNumber: '45' },
    ],
    status: 'Confirmed',
  },
];

function getInitialStorage(key, fallback = []) {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  if (saved) try { return JSON.parse(saved); } catch (_) {}
  return fallback;
}

export function BookingProvider({ children }) {
  const [orders, setOrders] = useState(() => getInitialStorage('ticketx-orders', SAMPLE_ORDERS));
  const [purchasedTickets, setPurchasedTickets] = useState(() => getInitialStorage('ticketx-purchased-tickets', SAMPLE_TICKETS));
  const [holdTimeSeconds, setHoldTimeSeconds] = useState(600); // 10 minutes (600s)
  const [holdActive, setHoldActive] = useState(false);

  // Hold timer interval
  useEffect(() => {
    if (!holdActive) return;

    const interval = setInterval(() => {
      setHoldTimeSeconds((prev) => {
        if (prev <= 1) {
          setHoldActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [holdActive]);

  const startHoldTimer = useCallback(() => {
    setHoldTimeSeconds(600);
    setHoldActive(true);
  }, []);

  const resetHoldTimer = useCallback(() => {
    setHoldActive(false);
    setHoldTimeSeconds(600);
  }, []);

  const createOrder = (cartItems, customerInfo, paymentSummary, pricing) => {
    const orderId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookedAt = new Date().toISOString();

    const newOrder = {
      orderId,
      date: bookedAt,
      customer: customerInfo,
      payment: paymentSummary,
      items: cartItems,
      pricing,
      status: 'Confirmed',
    };

    // Gate labels cycle through realistic gates
    const GATES = ['Gate A · Main Entrance', 'Gate B · Entrance 2', 'Gate C · VIP Entrance', 'Gate D · Entrance 4', 'Gate E · North Stand'];

    // Generate one real ticket per seat booked (handles quantity > 1)
    const newTickets = [];
    cartItems.forEach((item) => {
      const qty = item.quantity || 1;
      const baseSeat = parseInt(item.seatNumber || item.seat || 1, 10);

      for (let i = 0; i < qty; i++) {
        const seatNum = isNaN(baseSeat) ? `${item.seat || 1}` : `${baseSeat + i}`;
        const gateIdx = Math.floor(Math.random() * GATES.length);
        const priceNum = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;

        newTickets.push({
          ticketId: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
          orderId,
          eventTitle: item.eventTitle || 'Live Event',
          eventSlug: item.eventSlug || '',
          category: item.category || item.ticketType || 'LIVE EVENT',
          date: item.date || 'Upcoming Date',
          time: item.time || '7:00 PM',
          venue: item.venue || 'Venue TBA',
          city: item.city || customerInfo?.city || 'City',
          section: item.sectionName || item.section || 'General',
          row: item.row || 'Row 1',
          seat: seatNum,
          ticketType: item.ticketType || 'Standard Ticket',
          gate: item.gate || GATES[gateIdx],
          bookedFrom: 'TicketX Primary Box Office',
          price: `$${priceNum.toFixed(2)}`,
          bookedAt,
          status: 'CONFIRMED',
        });
      }
    });

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      localStorage.setItem('ticketx-orders', JSON.stringify(next));
      return next;
    });

    setPurchasedTickets((prev) => {
      const next = [...newTickets, ...prev];
      localStorage.setItem('ticketx-purchased-tickets', JSON.stringify(next));
      return next;
    });

    resetHoldTimer();
    return orderId;
  };

  const transferTicket = (ticketId, recipientName, recipientEmail) => {
    setPurchasedTickets((prev) => {
      const next = prev.map((ticket) => {
        if (ticket.ticketId === ticketId) {
          return {
            ...ticket,
            status: 'Transferred',
            transferredTo: { name: recipientName, email: recipientEmail, date: new Date().toISOString() },
          };
        }
        return ticket;
      });
      localStorage.setItem('ticketx-purchased-tickets', JSON.stringify(next));
      return next;
    });
  };

  const listTicketForResale = (ticketId, resalePrice) => {
    setPurchasedTickets((prev) => {
      const next = prev.map((ticket) => {
        if (ticket.ticketId === ticketId) {
          return {
            ...ticket,
            status: 'Listed for Resale',
            resalePrice: Number(resalePrice),
            resaleListedAt: new Date().toISOString(),
          };
        }
        return ticket;
      });
      localStorage.setItem('ticketx-purchased-tickets', JSON.stringify(next));
      return next;
    });
  };

  const cancelResaleListing = (ticketId) => {
    setPurchasedTickets((prev) => {
      const next = prev.map((ticket) => {
        if (ticket.ticketId === ticketId) {
          return {
            ...ticket,
            status: 'Confirmed',
            resalePrice: null,
            resaleListedAt: null,
          };
        }
        return ticket;
      });
      localStorage.setItem('ticketx-purchased-tickets', JSON.stringify(next));
      return next;
    });
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <BookingContext.Provider
      value={{
        orders,
        purchasedTickets,
        holdTimeSeconds,
        holdActive,
        startHoldTimer,
        resetHoldTimer,
        createOrder,
        transferTicket,
        listTicketForResale,
        cancelResaleListing,
        formattedHoldTimer: formatTimer(holdTimeSeconds),
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
