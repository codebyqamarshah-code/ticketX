import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyAdminSession, logAdminAction } from '@/lib/adminAuth';

export async function GET(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // If specific user details requested
    const singleUserId = searchParams.get('id');
    if (singleUserId) {
      const user = await User.findOne({ 
        $or: [{ _id: singleUserId.match(/^[0-9a-fA-F]{24}$/) ? singleUserId : null }, { id: singleUserId }]
      }, '-password -emailVerificationOtpHash -resetPasswordOtpHash');

      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      // Fetch all bookings/orders for this user
      const userOrders = await Order.find({
        $or: [
          { 'customer.email': user.email.toLowerCase() },
          { userId: user.id }
        ]
      }).sort({ createdAt: -1 });

      const totalBookings = userOrders.length;
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

      return NextResponse.json({
        success: true,
        user: {
          ...user.toObject(),
          totalBookings,
          totalSpent,
          orders: userOrders
        }
      });
    }

    // Filter params
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || 'All';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'newest'; // 'newest', 'name', 'bookings'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const exportCsv = searchParams.get('export') === 'csv';

    // Build query
    const query = { isDeleted: { $ne: true } };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { id: regex },
        { phone: regex },
        { city: regex }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Counts for stats summary
    const [totalRegistered, totalActive, totalSuspended] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ isDeleted: { $ne: true }, status: 'Active' }),
      User.countDocuments({ isDeleted: { $ne: true }, status: 'Suspended' })
    ]);

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'name') sortOptions = { firstName: 1, lastName: 1 };

    // Fetch users (if exporting to CSV, fetch all matching records; otherwise paginate)
    const findQuery = User.find(query, '-password -emailVerificationOtpHash -resetPasswordOtpHash');
    
    if (!exportCsv && sortBy !== 'bookings') {
      findQuery.sort(sortOptions).skip((page - 1) * limit).limit(limit);
    } else {
      findQuery.sort(sortOptions);
    }

    const rawUsers = await findQuery.lean();
    const totalMatching = await User.countDocuments(query);

    // Aggregate booking counts & spending for users
    const emails = rawUsers.map(u => u.email.toLowerCase());
    const orderAgg = await Order.aggregate([
      { $match: { 'customer.email': { $in: emails }, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: '$customer.email',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$pricing.grandTotal' }
        }
      }
    ]);

    const orderMap = {};
    orderAgg.forEach(item => {
      orderMap[item._id] = {
        totalBookings: item.totalBookings,
        totalSpent: item.totalSpent
      };
    });

    let users = rawUsers.map(u => {
      const stats = orderMap[u.email.toLowerCase()] || { totalBookings: 0, totalSpent: 0 };
      return {
        ...u,
        totalBookings: stats.totalBookings,
        totalSpent: stats.totalSpent
      };
    });

    // If sorting by bookings, sort in-memory
    if (sortBy === 'bookings') {
      users.sort((a, b) => b.totalBookings - a.totalBookings);
      if (!exportCsv) {
        users = users.slice((page - 1) * limit, page * limit);
      }
    }

    // CSV export mode
    if (exportCsv) {
      const header = 'User ID,Full Name,Email,Role,Status,Verified,Total Bookings,Total Spent ($),City,Country,Registered At\n';
      const rows = users.map(u => {
        const name = `"${(u.firstName || '') + ' ' + (u.lastName || '')}"`.trim();
        const email = `"${u.email}"`;
        const role = u.role || 'user';
        const st = u.status || 'Active';
        const ver = u.emailVerified ? 'Yes' : 'No';
        const bk = u.totalBookings || 0;
        const sp = (u.totalSpent || 0).toFixed(2);
        const city = `"${u.city || ''}"`;
        const country = `"${u.country || ''}"`;
        const reg = u.createdAt ? new Date(u.createdAt).toISOString() : '';
        return `${u.id || u._id},${name},${email},${role},${st},${ver},${bk},${sp},${city},${country},${reg}`;
      }).join('\n');

      return new Response(header + rows, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="ticketx-users-${Date.now()}.csv"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      users,
      stats: {
        totalRegistered,
        totalActive,
        totalSuspended
      },
      pagination: {
        page,
        limit,
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / limit) || 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve users' }, { status: 500 });
  }
}

export async function PUT(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const { userId, status } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    if (!['Active', 'Suspended'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const user = await User.findOne({
      $or: [{ _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }, { id: userId }]
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.role === 'super_admin') {
      return NextResponse.json({ success: false, message: 'Cannot modify Super Admin accounts' }, { status: 403 });
    }

    user.status = status;
    await user.save();

    await logAdminAction(
      auth.admin.email,
      status === 'Suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      'USER',
      user.id || user._id.toString(),
      `Status changed to ${status} for ${user.email}`,
      req
    );

    return NextResponse.json({ 
      success: true, 
      message: `User account has been successfully ${status === 'Suspended' ? 'suspended' : 'reactivated'}.`,
      user: { id: user.id, status: user.status }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ success: false, message: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findOne({
      $or: [{ _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }, { id: userId }]
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.role === 'super_admin') {
      return NextResponse.json({ success: false, message: 'Cannot delete Super Admin account' }, { status: 403 });
    }

    // Check if user has orders
    const hasOrders = await Order.exists({
      $or: [{ 'customer.email': user.email.toLowerCase() }, { userId: user.id }]
    });

    // If user has confirmed orders, soft-delete to preserve legal/financial records
    if (hasOrders) {
      user.isDeleted = true;
      user.status = 'Suspended';
      await user.save();
    } else {
      await User.deleteOne({ _id: user._id });
    }

    await logAdminAction(
      auth.admin.email,
      'USER_DELETED',
      'USER',
      user.id || user._id.toString(),
      `User ${user.email} was removed/deactivated (hasOrders: ${Boolean(hasOrders)})`,
      req
    );

    return NextResponse.json({ 
      success: true, 
      message: 'User account has been securely removed.' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}
