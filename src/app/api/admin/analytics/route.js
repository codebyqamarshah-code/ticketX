import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';
import Order from '@/models/Order';
import AuditLog from '@/models/AuditLog';
import { verifyAdminSession } from '@/lib/adminAuth';
import { ensureEventsSeeded } from '@/lib/eventsSync';

export async function GET(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    await ensureEventsSeeded();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'all'; // 'today', '7d', '30d', 'all'

    // Compute date cutoff
    let dateCutoff = null;
    const now = new Date();
    if (range === 'today') {
      dateCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === '7d') {
      dateCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      dateCutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const orderFilter = {};
    if (dateCutoff) {
      orderFilter.createdAt = { $gte: dateCutoff };
    }

    // 1. User metrics
    const [totalUsers, activeUsers, suspendedUsers] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ isDeleted: { $ne: true }, status: 'Active' }),
      User.countDocuments({ isDeleted: { $ne: true }, status: 'Suspended' })
    ]);

    // 2. Event metrics
    const [totalEvents, publishedEvents, draftEvents, soldOutEvents] = await Promise.all([
      Event.countDocuments({ isDeleted: { $ne: true } }),
      Event.countDocuments({ isDeleted: { $ne: true }, status: 'Published' }),
      Event.countDocuments({ isDeleted: { $ne: true }, status: 'Draft' }),
      Event.countDocuments({ isDeleted: { $ne: true }, status: 'Sold Out' })
    ]);

    // 3. Order & Financial metrics (filtered by range)
    const orders = await Order.find(orderFilter).lean();

    let grossSales = 0;
    let refunds = 0;
    let confirmedBookings = 0;
    let totalTicketsSold = 0;

    orders.forEach(o => {
      const grandTotal = o.pricing?.grandTotal || 0;
      const qty = o.quantity || 1;

      if (o.status === 'Confirmed' || o.payment?.status === 'Paid') {
        grossSales += grandTotal;
        confirmedBookings += 1;
        totalTicketsSold += qty;
      }

      if (o.status === 'Refunded' || o.payment?.status === 'Refunded') {
        refunds += grandTotal;
      }
    });

    const netRevenue = Math.max(0, grossSales - refunds);

    // 4. Top Selling Events (Aggregated from Orders)
    const eventSalesMap = {};
    orders.forEach(o => {
      if (o.status === 'Confirmed') {
        const title = o.eventTitle || 'Unknown Event';
        if (!eventSalesMap[title]) {
          eventSalesMap[title] = { title, ticketsSold: 0, revenue: 0, slug: o.eventSlug || '' };
        }
        eventSalesMap[title].ticketsSold += (o.quantity || 1);
        eventSalesMap[title].revenue += (o.pricing?.grandTotal || 0);
      }
    });

    const topSellingEvents = Object.values(eventSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 5. Inventory Overview
    const allEvents = await Event.find({ isDeleted: { $ne: true } }).select('availableSeats totalCapacity title status').lean();
    const totalCapacity = allEvents.reduce((s, e) => s + (e.totalCapacity || e.availableSeats || 0), 0);
    const availableInventory = allEvents.reduce((s, e) => s + (e.availableSeats || 0), 0);

    // 6. Recent Orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // 7. Recent Admin Audit Logs
    const recentActivities = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({
      success: true,
      range,
      overview: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalEvents,
        publishedEvents,
        draftEvents,
        soldOutEvents,
        grossSales,
        refunds,
        netRevenue,
        confirmedBookings,
        totalTicketsSold,
        totalCapacity,
        availableInventory
      },
      topSellingEvents,
      recentOrders,
      recentActivities
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    return NextResponse.json({ success: false, message: 'Failed to aggregate analytics.' }, { status: 500 });
  }
}
