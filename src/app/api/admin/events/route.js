import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import { verifyAdminSession, logAdminAction } from '@/lib/adminAuth';
import { ensureEventsSeeded } from '@/lib/eventsSync';

export async function GET(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    await ensureEventsSeeded();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'newest'; // 'newest', 'oldest', 'priceAsc', 'priceDesc', 'date'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '12', 10));

    // Base query
    const query = { isDeleted: { $ne: true } };

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { title: regex },
        { artist: regex },
        { venue: regex },
        { city: regex },
        { description: regex }
      ];
    }

    // Counts for stat bar
    const [totalEvents, publishedCount, draftCount, soldOutCount] = await Promise.all([
      Event.countDocuments({ isDeleted: { $ne: true } }),
      Event.countDocuments({ isDeleted: { $ne: true }, status: 'Published' }),
      Event.countDocuments({ isDeleted: { $ne: true }, status: 'Draft' }),
      Event.countDocuments({ isDeleted: { $ne: true }, status: 'Sold Out' })
    ]);

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'priceAsc') sortOptions = { priceFrom: 1 };
    if (sortBy === 'priceDesc') sortOptions = { priceFrom: -1 };
    if (sortBy === 'date') sortOptions = { date: 1 };

    const totalMatching = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      events,
      stats: {
        totalEvents,
        publishedCount,
        draftCount,
        soldOutCount
      },
      pagination: {
        page,
        limit,
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / limit) || 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve events' }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const data = await req.json();

    // Validation
    const { title, artist, category, description, city, venue, date, time, image } = data;
    if (!title || !artist || !category || !description || !city || !venue || !date || !time) {
      return NextResponse.json({ success: false, message: 'Please fill in all required event details.' }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ success: false, message: 'Event cover image is required.' }, { status: 400 });
    }

    // Validate ticket types
    let ticketTypes = data.ticketTypes || [];
    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      // Fallback single ticket type from priceFrom if provided
      const p = Number(data.priceFrom) || 50;
      const q = Number(data.availableSeats) || 200;
      ticketTypes = [{
        id: `tt-${Date.now()}-1`,
        name: 'General Admission',
        description: 'Standard event entry',
        price: p,
        totalQuantity: q,
        availableQuantity: q,
        maxPerCustomer: 8,
        section: 'General Admission',
        status: 'Available'
      }];
    }

    // Validate each ticket type
    for (const tt of ticketTypes) {
      if (!tt.name || tt.name.trim() === '') {
        return NextResponse.json({ success: false, message: 'Every ticket type must have a valid name.' }, { status: 400 });
      }
      const p = Number(tt.price);
      if (isNaN(p) || p < 0) {
        return NextResponse.json({ success: false, message: `Invalid price for ticket type: "${tt.name}". Price must be >= 0.` }, { status: 400 });
      }
      const q = Number(tt.totalQuantity || tt.availableQuantity);
      if (isNaN(q) || q < 1) {
        return NextResponse.json({ success: false, message: `Ticket quantity for "${tt.name}" must be at least 1.` }, { status: 400 });
      }
      tt.price = p;
      tt.totalQuantity = q;
      tt.availableQuantity = typeof tt.availableQuantity === 'number' ? tt.availableQuantity : q;
      if (!tt.id) tt.id = `tt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Calculate prices & inventory
    const prices = ticketTypes.map(t => t.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalAvail = ticketTypes.reduce((sum, t) => sum + (t.availableQuantity || 0), 0);
    const totalCap = ticketTypes.reduce((sum, t) => sum + (t.totalQuantity || 0), 0);

    // Create unique slug
    let baseSlug = (title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const eventId = data.id || `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newEvent = new Event({
      id: eventId,
      slug,
      title: title.trim(),
      artist: artist.trim(),
      artistSlug: artist.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category.toLowerCase(),
      subcategory: data.subcategory || '',
      description: description.trim(),
      city: city.trim(),
      country: data.country || 'USA',
      cityId: city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      venue: venue.trim(),
      venueSlug: venue.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      venueAddress: data.venueAddress || '',
      date,
      time,
      endTime: data.endTime || '',
      timezone: data.timezone || 'America/New_York',
      image,
      currency: data.currency || 'USD',
      status: data.status || 'Published',
      ticketTypes,
      priceFrom: minPrice,
      priceTo: maxPrice,
      availableSeats: totalAvail,
      totalCapacity: totalCap,
      isFeatured: !!data.isFeatured,
      isTrending: !!data.isTrending,
      isPopular: !!data.isPopular,
      isVIP: ticketTypes.some(t => t.name.toLowerCase().includes('vip')),
      tags: data.tags || [category.toLowerCase(), city.toLowerCase()],
      uploadedByAdmin: true,
      createdBy: auth.admin.email
    });

    await newEvent.save();

    await logAdminAction(
      auth.admin.email,
      newEvent.status === 'Draft' ? 'EVENT_DRAFT_SAVED' : 'EVENT_PUBLISHED',
      'EVENT',
      newEvent.id,
      `Event "${newEvent.title}" (${newEvent.status}) created with ${ticketTypes.length} ticket tiers.`,
      req
    );

    return NextResponse.json({
      success: true,
      message: `Event "${newEvent.title}" has been successfully ${newEvent.status === 'Draft' ? 'saved as draft' : 'published live'}!`,
      event: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, message: 'Failed to create event.' }, { status: 500 });
  }
}

export async function PUT(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const data = await req.json();
    const { id, _id } = data;

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: 'Event ID is required for editing.' }, { status: 400 });
    }

    const event = await Event.findOne({
      $or: [{ id }, { _id: _id?.match(/^[0-9a-fA-F]{24}$/) ? _id : null }]
    });

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found.' }, { status: 404 });
    }

    // Validate fields
    if (data.title) event.title = data.title.trim();
    if (data.artist) {
      event.artist = data.artist.trim();
      event.artistSlug = data.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (data.category) event.category = data.category.toLowerCase();
    if (data.subcategory !== undefined) event.subcategory = data.subcategory;
    if (data.description) event.description = data.description.trim();
    if (data.city) {
      event.city = data.city.trim();
      event.cityId = data.city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (data.venue) {
      event.venue = data.venue.trim();
      event.venueSlug = data.venue.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (data.venueAddress !== undefined) event.venueAddress = data.venueAddress;
    if (data.date) event.date = data.date;
    if (data.time) event.time = data.time;
    if (data.endTime !== undefined) event.endTime = data.endTime;
    if (data.timezone) event.timezone = data.timezone;
    if (data.image) event.image = data.image;
    if (data.currency) event.currency = data.currency;
    if (data.status) event.status = data.status;

    // Update ticket types if supplied
    if (Array.isArray(data.ticketTypes) && data.ticketTypes.length > 0) {
      for (const tt of data.ticketTypes) {
        if (!tt.name) continue;
        tt.price = Math.max(0, Number(tt.price) || 0);
        tt.totalQuantity = Math.max(1, Number(tt.totalQuantity || tt.availableQuantity) || 100);
        tt.availableQuantity = typeof tt.availableQuantity === 'number' ? tt.availableQuantity : tt.totalQuantity;
        if (!tt.id) tt.id = `tt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      }
      event.ticketTypes = data.ticketTypes;

      const prices = event.ticketTypes.map(t => t.price);
      event.priceFrom = Math.min(...prices);
      event.priceTo = Math.max(...prices);
      event.availableSeats = event.ticketTypes.reduce((sum, t) => sum + (t.availableQuantity || 0), 0);
      event.totalCapacity = event.ticketTypes.reduce((sum, t) => sum + (t.totalQuantity || 0), 0);
    }

    await event.save();

    await logAdminAction(
      auth.admin.email,
      'EVENT_UPDATED',
      'EVENT',
      event.id,
      `Event "${event.title}" details and pricing updated.`,
      req
    );

    return NextResponse.json({
      success: true,
      message: `Event "${event.title}" updated successfully!`,
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, message: 'Failed to update event.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('id');

    if (!eventId) {
      return NextResponse.json({ success: false, message: 'Event ID is required.' }, { status: 400 });
    }

    const event = await Event.findOne({
      $or: [{ id: eventId }, { _id: eventId.match(/^[0-9a-fA-F]{24}$/) ? eventId : null }]
    });

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found.' }, { status: 404 });
    }

    // Safe delete / archive
    event.isDeleted = true;
    event.status = 'Cancelled';
    await event.save();

    await logAdminAction(
      auth.admin.email,
      'EVENT_DELETED',
      'EVENT',
      event.id,
      `Event "${event.title}" archived/deleted.`,
      req
    );

    return NextResponse.json({
      success: true,
      message: `Event "${event.title}" has been deleted.`
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete event.' }, { status: 500 });
  }
}
