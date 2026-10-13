import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Event from '@/models/Event';
import User from '@/models/User';
import { verifyAdminSession, logAdminAction } from '@/lib/adminAuth';
import { sendTicketConfirmationEmail } from '@/lib/email';

export async function GET(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Single order details request
    const singleOrderId = searchParams.get('orderId');
    if (singleOrderId) {
      const order = await Order.findOne({ orderId: singleOrderId }).lean();
      if (!order) {
        return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
      }

      // Check if user has an account reference in database
      const user = await User.findOne({ email: order.customer?.email?.toLowerCase() }, 'id firstName lastName email status createdAt').lean();

      return NextResponse.json({
        success: true,
        order: {
          ...order,
          customerAccount: user || null
        }
      });
    }

    const search = searchParams.get('search')?.trim() || '';
    const paymentStatus = searchParams.get('paymentStatus') || 'all';
    const bookingStatus = searchParams.get('bookingStatus') || searchParams.get('status') || 'all';
    const eventFilter = searchParams.get('event') || 'all';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '15', 10));
    const exportCsv = searchParams.get('export') === 'csv';

    const query = {};

    if (bookingStatus && bookingStatus !== 'all') {
      query.status = bookingStatus;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query['payment.status'] = paymentStatus;
    }

    if (eventFilter && eventFilter !== 'all') {
      query.$or = [
        { eventTitle: { $regex: new RegExp(eventFilter, 'i') } },
        { eventSlug: eventFilter }
      ];
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { orderId: regex },
        { eventTitle: regex },
        { 'customer.firstName': regex },
        { 'customer.lastName': regex },
        { 'customer.email': regex }
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Comprehensive real metrics from DB
    const allOrders = await Order.find({}).lean();
    const totalOrders = allOrders.length;
    
    // Confirmed orders: confirmed booking AND paid
    const confirmedOrdersList = allOrders.filter(o => o.status === 'Confirmed' && o.payment?.status === 'Paid');
    const confirmedOrders = confirmedOrdersList.length;
    
    const pendingPayments = allOrders.filter(o => o.payment?.status === 'Pending').length;
    const failedPayments = allOrders.filter(o => o.payment?.status === 'Failed').length;
    const cancelledOrders = allOrders.filter(o => o.status === 'Cancelled').length;

    const totalTicketQuantitySold = confirmedOrdersList.reduce((sum, o) => sum + (o.quantity || 1), 0);
    const grossSales = confirmedOrdersList.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

    const refundedOrdersList = allOrders.filter(o => o.status === 'Refunded' || o.payment?.status === 'Refunded');
    const refundedCount = refundedOrdersList.length;
    const refundedAmount = refundedOrdersList.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
    const netRevenue = Math.max(0, grossSales - refundedAmount);

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'amountHigh') sortOptions = { 'pricing.grandTotal': -1 };
    if (sortBy === 'amountLow') sortOptions = { 'pricing.grandTotal': 1 };

    // CSV Export Mode
    if (exportCsv) {
      const exportOrders = await Order.find(query).sort(sortOptions).lean();
      const header = 'Order ID,Customer Name,Customer Email,Event Title,Ticket Tier,Quantity,Subtotal,Fees,Tax,Grand Total,Currency,Payment Status,Booking Status,Created At\n';
      const rows = exportOrders.map(o => {
        const id = o.orderId;
        const name = `"${(o.customer?.firstName || '') + ' ' + (o.customer?.lastName || '')}"`.trim();
        const email = `"${o.customer?.email || ''}"`;
        const event = `"${o.eventTitle || ''}"`;
        const tier = `"${o.ticketType || 'Standard'}"`;
        const qty = o.quantity || 1;
        const sub = (o.pricing?.subtotal || 0).toFixed(2);
        const fees = ((o.pricing?.serviceFee || 0) + (o.pricing?.facilityFee || 0)).toFixed(2);
        const tax = (o.pricing?.tax || 0).toFixed(2);
        const total = (o.pricing?.grandTotal || 0).toFixed(2);
        const cur = o.currency || 'USD';
        const pStatus = o.payment?.status || 'Paid';
        const bStatus = o.status || 'Confirmed';
        const date = o.createdAt ? new Date(o.createdAt).toISOString() : '';
        return `${id},${name},${email},${event},${tier},${qty},${sub},${fees},${tax},${total},${cur},${pStatus},${bStatus},${date}`;
      }).join('\n');

      return new Response(header + rows, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="ticketx-orders-${Date.now()}.csv"`
        }
      });
    }

    const totalMatching = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      orders,
      stats: {
        totalOrders,
        confirmedOrders,
        pendingPayments,
        failedPayments,
        cancelledOrders,
        totalTicketQuantitySold,
        grossSales,
        refundedCount,
        refundedAmount,
        netRevenue
      },
      pagination: {
        page,
        limit,
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / limit) || 1
      }
    });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve orders.' }, { status: 500 });
  }
}

export async function PUT(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const body = await req.json();
    const { orderId, action, status, reason } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required.' }, { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found in database.' }, { status: 404 });
    }

    // Action 1: Resend Ticket Confirmation Email
    if (action === 'resend-confirmation') {
      const emailResult = await sendTicketConfirmationEmail(order.customer?.email, order);
      
      order.confirmationEmailSentAt = new Date();
      order.confirmationEmailCount = (order.confirmationEmailCount || 1) + 1;
      
      if (!order.timeline) order.timeline = [];
      order.timeline.push({
        action: 'CONFIRMATION_RESENT',
        timestamp: new Date(),
        actor: auth.admin.email,
        note: `Ticket confirmation email resent to ${order.customer?.email}`
      });
      await order.save();

      await logAdminAction(
        auth.admin.email,
        'TICKET_CONFIRMATION_RESENT',
        'ORDER',
        order.orderId,
        `Confirmation passes resent to ${order.customer?.email}`,
        req
      );

      return NextResponse.json({
        success: true,
        message: `Ticket confirmation email resent successfully to ${order.customer?.email}!`,
        order
      });
    }

    // Action 2: Process Refund
    if (action === 'refund' || status === 'Refunded') {
      if (order.status === 'Refunded') {
        return NextResponse.json({ success: false, message: 'Order is already marked as refunded.' }, { status: 400 });
      }

      order.status = 'Refunded';
      order.payment.status = 'Refunded';
      order.refundReason = reason || 'Refund issued and authorized by Super Admin.';
      order.refundedAt = new Date();

      // Invalidate ticket passes
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          item.validationStatus = 'Cancelled';
        });
      }

      // Restore ticket inventory on Event
      const event = await Event.findOne({
        $or: [{ slug: order.eventSlug }, { title: order.eventTitle }]
      });

      if (event) {
        event.availableSeats = (event.availableSeats || 0) + (order.quantity || 1);
        if (event.ticketTypes && event.ticketTypes.length > 0) {
          const matchedType = event.ticketTypes.find(t => t.name === order.ticketType) || event.ticketTypes[0];
          if (matchedType) {
            matchedType.availableQuantity += (order.quantity || 1);
          }
        }
        if (event.status === 'Sold Out') {
          event.status = 'Published';
        }
        await event.save();
      }

      if (!order.timeline) order.timeline = [];
      order.timeline.push({
        action: 'ORDER_REFUNDED',
        timestamp: new Date(),
        actor: auth.admin.email,
        note: reason || 'Refund approved. Ticket passes revoked and inventory restored.'
      });

      await order.save();

      await logAdminAction(
        auth.admin.email,
        'ORDER_REFUNDED',
        'ORDER',
        order.orderId,
        `Refund of $${order.pricing?.grandTotal.toFixed(2)} processed for ${order.customer?.email}. Inventory restored.`,
        req
      );

      return NextResponse.json({
        success: true,
        message: `Order #${order.orderId} has been refunded. $${order.pricing?.grandTotal.toFixed(2)} refunded and ${order.quantity} ticket(s) restored to event inventory.`,
        order
      });
    }

    // Action 3: Cancel Booking
    if (action === 'cancel' || status === 'Cancelled') {
      if (order.status === 'Cancelled') {
        return NextResponse.json({ success: false, message: 'Order is already cancelled.' }, { status: 400 });
      }

      order.status = 'Cancelled';
      order.cancellationReason = reason || 'Booking cancelled by Super Admin.';
      order.cancelledAt = new Date();

      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          item.validationStatus = 'Cancelled';
        });
      }

      // Restore ticket inventory
      const event = await Event.findOne({
        $or: [{ slug: order.eventSlug }, { title: order.eventTitle }]
      });

      if (event) {
        event.availableSeats = (event.availableSeats || 0) + (order.quantity || 1);
        if (event.ticketTypes && event.ticketTypes.length > 0) {
          const matchedType = event.ticketTypes.find(t => t.name === order.ticketType) || event.ticketTypes[0];
          if (matchedType) {
            matchedType.availableQuantity += (order.quantity || 1);
          }
        }
        if (event.status === 'Sold Out') {
          event.status = 'Published';
        }
        await event.save();
      }

      if (!order.timeline) order.timeline = [];
      order.timeline.push({
        action: 'ORDER_CANCELLED',
        timestamp: new Date(),
        actor: auth.admin.email,
        note: reason || 'Booking cancelled by Super Admin.'
      });

      await order.save();

      await logAdminAction(
        auth.admin.email,
        'ORDER_CANCELLED',
        'ORDER',
        order.orderId,
        `Order #${order.orderId} cancelled by Super Admin.`,
        req
      );

      return NextResponse.json({
        success: true,
        message: `Order #${order.orderId} cancelled and tickets released back to inventory.`,
        order
      });
    }

    return NextResponse.json({ success: false, message: 'Unrecognized order action.' }, { status: 400 });
  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to process order action.' }, { status: 500 });
  }
}
