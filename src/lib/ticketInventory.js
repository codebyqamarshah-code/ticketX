// Decoupled, reference-matched venue seat inventory engine for TicketX

export const DEFAULT_STAGE_CONFIG = {
  position: 'left', // Configurable: 'left' (reference venue), 'top', 'right', 'center'
  orientation: 'vertical',
  x: 40,
  y: 150,
  width: 90,
  height: 380,
  label: 'STAGE · PERFORMANCE AREA',
};

export const DEFAULT_SECTIONS = [
  // ORCHESTRA TIER (Front Stage)
  {
    id: 'sec-orch-c',
    name: 'Orchestra Center',
    category: 'VIP Front Stage Pit',
    priceMultiplier: 2.5,
    isVIP: true,
    rowsCount: 7,
    seatsPerRow: 11,
    x: 170,
    y: 210,
    width: 220,
    height: 260,
    svgPath: 'M 170 210 H 390 V 470 H 170 Z',
    badge: 'VIP Orchestra Center',
  },
  {
    id: 'sec-orch-l',
    name: 'Orchestra Left',
    category: 'VIP Front Side Wing',
    priceMultiplier: 2.0,
    isVIP: true,
    rowsCount: 5,
    seatsPerRow: 10,
    x: 170,
    y: 50,
    width: 220,
    height: 140,
    svgPath: 'M 170 50 H 390 V 190 H 170 Z',
    badge: 'Orchestra Left',
  },
  {
    id: 'sec-orch-r',
    name: 'Orchestra Right',
    category: 'VIP Front Side Wing',
    priceMultiplier: 2.0,
    isVIP: true,
    rowsCount: 5,
    seatsPerRow: 10,
    x: 170,
    y: 490,
    width: 220,
    height: 140,
    svgPath: 'M 170 490 H 390 V 630 H 170 Z',
    badge: 'Orchestra Right',
  },

  // MEZZANINE TIER (Middle Tier)
  {
    id: 'sec-mezz-c',
    name: 'Mezzanine Center',
    category: 'Mid-Tier Prime View',
    priceMultiplier: 1.6,
    rowsCount: 7,
    seatsPerRow: 12,
    x: 420,
    y: 210,
    width: 240,
    height: 260,
    svgPath: 'M 420 210 H 660 V 470 H 420 Z',
    badge: 'Mezzanine Center',
  },
  {
    id: 'sec-mezz-l',
    name: 'Mezzanine Left',
    category: 'Mid-Tier Side Angle',
    priceMultiplier: 1.4,
    rowsCount: 5,
    seatsPerRow: 11,
    x: 420,
    y: 50,
    width: 240,
    height: 140,
    svgPath: 'M 420 50 H 660 V 190 H 420 Z',
    badge: 'Mezzanine Left',
  },
  {
    id: 'sec-mezz-r',
    name: 'Mezzanine Right',
    category: 'Mid-Tier Side Angle',
    priceMultiplier: 1.4,
    rowsCount: 5,
    seatsPerRow: 11,
    x: 420,
    y: 490,
    width: 240,
    height: 140,
    svgPath: 'M 420 490 H 660 V 630 H 420 Z',
    badge: 'Mezzanine Right',
  },

  // MIX CONTROL BOOTH (Centered between Mezzanine and Balcony)
  {
    id: 'sec-mix',
    name: 'MIX BOOTH',
    category: 'Audio & Lighting Production Desk',
    isMix: true,
    x: 685,
    y: 300,
    width: 75,
    height: 80,
    svgPath: 'M 685 300 H 760 V 380 H 685 Z',
    badge: 'MIX Control',
    rowsCount: 0,
    seatsPerRow: 0,
  },

  // BALCONY TIER (Rear Tier)
  {
    id: 'sec-balc-c',
    name: 'Balcony Center',
    category: 'Upper Tier Elevated View',
    priceMultiplier: 1.1,
    rowsCount: 7,
    seatsPerRow: 13,
    x: 780,
    y: 210,
    width: 260,
    height: 260,
    svgPath: 'M 780 210 H 1040 V 470 H 780 Z',
    badge: 'Balcony Center',
  },
  {
    id: 'sec-balc-l',
    name: 'Balcony Left',
    category: 'Upper Tier Resale Hub',
    priceMultiplier: 0.9,
    isResale: true,
    rowsCount: 5,
    seatsPerRow: 12,
    x: 780,
    y: 50,
    width: 260,
    height: 140,
    svgPath: 'M 780 50 H 1040 V 190 H 780 Z',
    badge: 'Balcony Left Resale',
  },
  {
    id: 'sec-balc-r',
    name: 'Balcony Right',
    category: 'Upper Tier Accessible',
    priceMultiplier: 0.95,
    isAccessible: true,
    rowsCount: 5,
    seatsPerRow: 12,
    x: 780,
    y: 490,
    width: 260,
    height: 140,
    svgPath: 'M 780 490 H 1040 V 630 H 780 Z',
    badge: 'Balcony Right ADA',
  },
];

export function generateEventSeatMap(event, customSections = null, customStage = null) {
  if (!event) return { stage: DEFAULT_STAGE_CONFIG, sections: [], seats: [] };
  const basePrice = event.priceFrom || 75;
  const sectionsToUse = customSections || DEFAULT_SECTIONS;
  const stageConfig = customStage || DEFAULT_STAGE_CONFIG;
  const venueId = event.venueSlug || 'default-venue';

  const seats = [];
  const processedSections = sectionsToUse.map((sec) => {
    if (sec.isMix || sec.rowsCount === 0) {
      return {
        ...sec,
        startingPrice: 0,
        totalSeats: 0,
        availableCount: 0,
        status: 'Technical Desk',
      };
    }

    const rows = sec.rowsCount || 5;
    const minPrice = Math.round(basePrice * sec.priceMultiplier);
    let sectionAvailableCount = 0;

    for (let r = 1; r <= rows; r++) {
      const rowLetter = String.fromCharCode(64 + r); // Row A, B, C...
      const seatsInRow = (sec.seatsPerRow || 10) + (r % 2 === 0 ? 1 : 0);

      const ySpacing = sec.height / (rows + 1);
      const xSpacing = sec.width / (seatsInRow + 1);

      for (let s = 1; s <= seatsInRow; s++) {
        // Deterministic realistic mixed availability pattern
        const isUnavailable = (r * 7 + s * 13 + sec.name.length) % 6 === 0 || (r === 1 && s === 3);
        const isResale = sec.isResale || (r === 2 && s === 6);
        const isVIP = sec.isVIP;
        const isAccessible = sec.isAccessible || (sec.id === 'sec-balc-r' && r === 1);
        const price = Math.round(basePrice * sec.priceMultiplier + (rows - r) * 3);

        const seatId = `${event.id}:${venueId}:${sec.id}:R${rowLetter}:S${s}`;

        if (!isUnavailable) {
          sectionAvailableCount++;
        }

        const seatX = sec.x + s * xSpacing;
        const seatY = sec.y + r * ySpacing;

        seats.push({
          id: seatId,
          eventId: event.id,
          venueId,
          sectionId: sec.id,
          sectionName: sec.name,
          category: sec.category,
          row: `Row ${rowLetter}`,
          rowLetter,
          seatNumber: s,
          seatLabel: `${sec.name}, Row ${rowLetter}, Seat ${s}`,
          price,
          isAvailable: !isUnavailable,
          isVIP,
          isResale,
          isAccessible,
          ticketType: isVIP ? 'VIP Package' : isResale ? 'Resale Ticket' : isAccessible ? 'Accessible Ticket' : 'Standard Ticket',
          x: seatX,
          y: seatY,
        });
      }
    }

    return {
      ...sec,
      startingPrice: minPrice,
      totalSeats: seats.filter((s) => s.sectionId === sec.id).length,
      availableCount: sectionAvailableCount,
      status: sectionAvailableCount === 0 ? 'Sold Out' : sectionAvailableCount < 10 ? 'Limited' : 'Available',
    };
  });

  return {
    stage: stageConfig,
    sections: processedSections,
    seats,
  };
}

/**
 * Finds best available contiguous or nearby seats based on active filters
 */
export function findBestAvailableSeats(seats, quantity = 2, filterOptions = {}) {
  const { priceMin = 0, priceMax = Infinity, selectedTypes = [] } = filterOptions;

  const eligible = seats.filter((s) => {
    if (!s.isAvailable) return false;
    if (s.price < priceMin || s.price > priceMax) return false;
    if (selectedTypes.length > 0) {
      if (!selectedTypes.includes(s.ticketType)) return false;
    }
    return true;
  });

  if (eligible.length === 0) return [];

  // Group by section & row
  const grouped = {};
  eligible.forEach((s) => {
    const key = `${s.sectionId}-${s.row}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });

  // Search for contiguous seats in the same row
  for (const key of Object.keys(grouped)) {
    const rowSeats = grouped[key].sort((a, b) => a.seatNumber - b.seatNumber);
    for (let i = 0; i <= rowSeats.length - quantity; i++) {
      const slice = rowSeats.slice(i, i + quantity);
      const isContiguous = slice.every((st, idx) => idx === 0 || st.seatNumber === slice[idx - 1].seatNumber + 1);
      if (isContiguous) {
        return slice.map((s) => s.id);
      }
    }
  }

  // Fallback: Top N available seats by price
  return eligible
    .sort((a, b) => b.price - a.price)
    .slice(0, quantity)
    .map((s) => s.id);
}
