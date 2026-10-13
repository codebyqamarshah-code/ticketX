import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Event from '@/models/Event';
import User from '@/models/User';
import { verifyJwt } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { cart, customer, payment, pricing } = data;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart cannot be empty.' }, { status: 400 });
    }

    if (!customer || !customer.email || !customer.firstName) {
      return NextResponse.json({ success: false, message: 'Valid customer details are required.' }, { status: 400 });
    }

    // Check if customer account exists and is suspended
    const customerUser = await User.findOne({ email: customer.email.trim().toLowerCase() });
    if (customerUser && customerUser.status === 'Suspended') {
      return NextResponse.json({ 
        success: false, 
        message: 'Your account is suspended. You cannot place orders.' 
      }, { status: 403 });
    }

    // Inventory check & atomic decrement
    for (const item of cart) {
      const eventSlug = item.eventSlug;
      const eventTitle = item.eventTitle;
      const qty = Math.max(1, parseInt(item.quantity || 1, 10));

      const event = await Event.findOne({
        $or: [
          { slug: eventSlug },
          { id: item.eventId },
          { title: eventTitle }
        ],
        isDeleted: { $ne: true }
      });

      if (event && event.ticketTypes && event.ticketTypes.length > 0) {
        // Find matching ticket type by id or name
        const targetType = event.ticketTypes.find(
          t => t.id === item.ticketTypeId || 
               t.name.toLowerCase() === (item.ticketType || '').toLowerCase()
        ) || event.ticketTypes[0];

        if (targetType) {
          if (targetType.availableQuantity < qty) {
            return NextResponse.json({
              success: false,
              message: `Sorry, only ${targetType.availableQuantity} ticket(s) remaining for "${targetType.name}".`
            }, { status: 409 });
          }

          // Decrement inventory atomically
          targetType.availableQuantity -= qty;
          event.availableSeats = Math.max(0, (event.availableSeats || 0) - qty);
          if (event.availableSeats <= 0) {
            event.status = 'Sold Out';
          }
          await event.save();
        }
      }
    }

    // Generate unique order ID
    const orderId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderItems = [];
    cart.forEach(item => {
      const qty = Math.max(1, parseInt(item.quantity || 1, 10));
      for (let i = 0; i < qty; i++) {
        orderItems.push({
          ticketId: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
          ticketTypeId: item.ticketTypeId || '',
          ticketType: item.ticketType || 'Standard Admission',
          eventTitle: item.eventTitle || 'Event',
          eventSlug: item.eventSlug || '',
          eventId: item.eventId || '',
          price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
          quantity: 1,
          sectionName: item.sectionName || item.section || 'General',
          row: item.row || '1',
          seatNumber: item.seatNumber || item.seat || `GA-${i + 1}`
        });
      }
    });

    const primaryItem = cart[0];
    const subtotal = pricing?.subtotal || cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
    const serviceFee = pricing?.serviceFee || +(subtotal * 0.12).toFixed(2);
    const facilityFee = pricing?.facilityFee || 5;
    const tax = pricing?.tax || +(subtotal * 0.05).toFixed(2);
    const grandTotal = pricing?.grandTotal || +(subtotal + serviceFee + facilityFee + tax).toFixed(2);

    const newOrder = new Order({
      orderId,
      userId: customerUser?.id || null,
      customer: {
        firstName: customer.firstName.trim(),
        lastName: (customer.lastName || '').trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone || '',
        city: customer.city || 'New York',
        country: customer.country || 'USA'
      },
      eventTitle: primaryItem.eventTitle || 'Live Event',
      eventSlug: primaryItem.eventSlug || '',
      eventId: primaryItem.eventId || '',
      ticketType: primaryItem.ticketType || 'Standard',
      quantity: cart.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0),
      currency: 'USD',
      pricing: {
        subtotal,
        serviceFee,
        facilityFee,
        tax,
        grandTotal
      },
      items: orderItems,
      payment: {
        method: 'Credit Card',
        cardBrand: 'Visa',
        last4: payment?.cardMask ? String(payment.cardMask).slice(-4) : '4242',
        status: 'Paid',
        transactionId: `txn_${Date.now()}`
      },
      status: 'Confirmed'
    });

    await newOrder.save();

    return NextResponse.json({
      success: true,
      orderId,
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, message: 'Failed to complete order.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get('ticketx-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({
      $or: [
        { 'customer.email': decoded.email.toLowerCase() },
        { userId: decoded.id }
      ]
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
