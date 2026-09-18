// Generates realistic data-driven seat maps for events

export const SEAT_SECTIONS = [
  { id: 'sec-floor-a', name: 'Floor A', category: 'VIP', priceMultiplier: 2.0, isVIP: true },
  { id: 'sec-floor-b', name: 'Floor B', category: 'VIP', priceMultiplier: 1.8, isVIP: true },
  { id: 'sec-lower-101', name: 'Section 101', category: 'Lower Bowl', priceMultiplier: 1.4, isVIP: false },
  { id: 'sec-lower-102', name: 'Section 102', category: 'Lower Bowl', priceMultiplier: 1.4, isVIP: false },
  { id: 'sec-lower-103', name: 'Section 103 (Accessible)', category: 'Lower Bowl', priceMultiplier: 1.2, isAccessible: true },
  { id: 'sec-upper-201', name: 'Section 201', category: 'Upper Bowl', priceMultiplier: 1.0, isVIP: false },
  { id: 'sec-upper-202', name: 'Section 202', category: 'Upper Bowl', priceMultiplier: 1.0, isVIP: false },
  { id: 'sec-upper-203', name: 'Section 203 (Resale)', category: 'Upper Bowl', priceMultiplier: 0.9, isResale: true },
];

export function generateEventSeatMap(event) {
  if (!event) return { sections: [], seats: [] };
  const basePrice = event.priceFrom || 75;

  const seats = [];
  SEAT_SECTIONS.forEach((sec) => {
    const rows = 4;
    const seatsPerRow = 8;

    for (let r = 1; r <= rows; r++) {
      for (let s = 1; s <= seatsPerRow; s++) {
        const seatId = `${sec.id}-r${r}-s${s}`;
        const isUnavailable = (r + s) % 7 === 0;
        const isResale = sec.isResale || (r === 2 && s === 3);
        const isVIP = sec.isVIP;
        const isAccessible = sec.isAccessible || (sec.id === 'sec-lower-103' && r === 1);

        const price = Math.round(basePrice * sec.priceMultiplier);

        seats.push({
          id: seatId,
          sectionId: sec.id,
          sectionName: sec.name,
          category: sec.category,
          row: `Row ${r}`,
          seatNumber: s,
          seatLabel: `Sec ${sec.name}, Row ${r}, Seat ${s}`,
          price,
          isAvailable: !isUnavailable,
          isVIP,
          isResale,
          isAccessible,
          ticketType: isVIP ? 'VIP Package' : isResale ? 'Resale Ticket' : 'Standard Ticket',
        });
      }
    }
  });

  return {
    sections: SEAT_SECTIONS,
    seats,
  };
}
