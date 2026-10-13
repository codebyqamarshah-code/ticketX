import connectDB from '@/lib/db';
import Event from '@/models/Event';
import { events as defaultEvents } from '@/data/events';

export async function ensureEventsSeeded() {
  await connectDB();

  // Retrieve existing event IDs and slugs
  const existingEvents = await Event.find({}, { id: 1, slug: 1, isDeleted: 1 }).lean();
  const existingIds = new Set(existingEvents.map((e) => e.id));
  const existingSlugs = new Set(existingEvents.map((e) => e.slug));

  const missingDocs = [];

  for (const e of defaultEvents) {
    if (existingIds.has(e.id) || existingSlugs.has(e.slug)) {
      continue;
    }

    const minP = Number(e.priceFrom) || 50;
    const maxP = Number(e.priceTo) || minP * 2;
    const gaQty = 350;
    const vipQty = 75;

    const ticketTypes = [
      {
        id: `tt-${e.id}-ga`,
        name: 'General Admission',
        description: 'Standard event entry with open general access area.',
        price: minP,
        totalQuantity: gaQty,
        availableQuantity: gaQty,
        maxPerCustomer: 8,
        section: 'General Floor',
        status: 'Available'
      },
      {
        id: `tt-${e.id}-vip`,
        name: 'VIP Front Stage Pass',
        description: 'Priority early gate entry, VIP lounge and front-stage prime viewing.',
        price: maxP,
        totalQuantity: vipQty,
        availableQuantity: vipQty,
        maxPerCustomer: 4,
        section: 'VIP Golden Circle',
        status: 'Available'
      }
    ];

    missingDocs.push({
      id: e.id,
      slug: e.slug || e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: e.title,
      artist: e.artist || e.title,
      artistSlug: e.artistSlug || '',
      category: e.category || 'concerts',
      subcategory: e.subcategory || '',
      description: e.description || `Official tickets for ${e.title} live at ${e.venue}.`,
      city: e.city || 'Los Angeles',
      country: e.country || 'USA',
      cityId: e.cityId || '',
      venue: e.venue || 'Arena TBA',
      venueSlug: e.venueSlug || '',
      venueAddress: e.venueAddress || '',
      date: e.date || '2026-11-15',
      time: e.time || '7:30 PM',
      endTime: e.endTime || '',
      timezone: e.timezone || 'America/New_York',
      image: e.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      currency: 'USD',
      status: e.availability === 'sold-out' ? 'Sold Out' : 'Published',
      ticketTypes,
      priceFrom: minP,
      priceTo: maxP,
      availableSeats: gaQty + vipQty,
      totalCapacity: gaQty + vipQty,
      isFeatured: !!e.isFeatured,
      isTrending: !!e.isTrending,
      isPopular: !!e.isPopular,
      isVIP: !!e.isVIP,
      isAccessible: true,
      tags: e.tags || [e.category],
      uploadedByAdmin: false,
      createdBy: 'System Seed',
      isDeleted: false
    });
  }

  if (missingDocs.length > 0) {
    try {
      await Event.insertMany(missingDocs, { ordered: false });
      console.log(`Successfully seeded ${missingDocs.length} missing events into MongoDB.`);
    } catch (err) {
      console.error('Error inserting missing events:', err?.message || err);
    }
  }
}
