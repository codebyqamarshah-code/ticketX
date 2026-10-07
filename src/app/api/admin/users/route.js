import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyJwt } from '@/lib/auth';

// Helper to check admin access
async function checkAdmin(req) {
  const token = req.cookies.get('ticketx-token')?.value;
  if (!token) return false;
  
  try {
    const payload = verifyJwt(token);
    return payload && payload.role === 'super_admin';
  } catch (e) {
    return false;
  }
}

export async function GET(req) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    // Fetch all users (excluding passwords and OTP hashes)
    const users = await User.find({}, '-password -emailVerificationOtpHash').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Update a user (e.g. suspend)
export async function PUT(req) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    const { userId, status } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Custom field in User schema? We don't have 'status' explicitly in the model, 
    // let's just add it dynamically or use 'role' to ban.
    // Let's add 'status' to the DB record. Mongoose strict mode might block it unless defined,
    // so we can update role to 'suspended' or add 'status' to the schema implicitly.
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.role === 'super_admin') {
      return NextResponse.json({ success: false, message: 'Cannot modify Super Admin' }, { status: 400 });
    }

    // Store status in a custom field (mongoose allows mixed if we use findByIdAndUpdate or we define it)
    await User.findByIdAndUpdate(userId, { $set: { status: status || 'Active' } }, { strict: false });

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (user && user.role === 'super_admin') {
      return NextResponse.json({ success: false, message: 'Cannot delete Super Admin' }, { status: 400 });
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
