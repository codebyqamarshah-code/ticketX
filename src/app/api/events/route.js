import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import { ensureEventsSeeded } from '@/lib/eventsSync';

export async function GET(req) {
  try {
    await connectDB();
    await ensureEventsSeeded();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

    if (slug) {
      const event = await Event.findOne({ slug, isDeleted: { $ne: true } }).lean();
      if (!event) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
      return NextResponse.json({ success: true, event });
    }

    if (id) {
      const event = await Event.findOne({ 
        $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
        isDeleted: { $ne: true }
      }).lean();
      if (!event) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
      return NextResponse.json({ success: true, event });
    }

    const query = { isDeleted: { $ne: true }, status: 'Published' };

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { title: regex },
        { artist: regex },
        { venue: regex },
        { city: regex }
      ];
    }

    const events = await Event.find(query).sort({ date: 1 }).limit(limit).lean();

    return NextResponse.json({ success: true, events, count: events.length });
  } catch (error) {
    console.error('Public events fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
