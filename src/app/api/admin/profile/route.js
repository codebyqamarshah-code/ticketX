import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { verifyAdminSession, logAdminAction } from '@/lib/adminAuth';

export async function GET(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const admin = await User.findById(auth.admin._id, '-password -emailVerificationOtpHash -resetPasswordOtpHash -pendingEmailOtpHash').lean();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin record not found.' }, { status: 404 });
    }

    // Telemetry & Session Info
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Modern Web Browser';

    // Recent Admin Activity logs
    const recentLogs = await AuditLog.find({ adminEmail: admin.email })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return NextResponse.json({
      success: true,
      profile: {
        ...admin,
        sessionInfo: {
          currentIp: ip,
          browser: userAgent.includes('Chrome') ? 'Google Chrome' : userAgent.includes('Firefox') ? 'Mozilla Firefox' : userAgent.includes('Safari') ? 'Apple Safari' : 'Secure Web Client',
          platform: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : 'Linux / Mobile',
          activeSince: admin.lastLoginAt || admin.updatedAt || admin.createdAt
        }
      },
      recentLogs
    });
  } catch (error) {
    console.error('Admin profile error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve admin profile.' }, { status: 500 });
  }
}

export async function PUT(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const { firstName, lastName, phone, city, country } = await req.json();

    if (!firstName || firstName.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'First name is required.' }, { status: 400 });
    }

    if (firstName.trim().length > 50) {
      return NextResponse.json({ success: false, message: 'First name cannot exceed 50 characters.' }, { status: 400 });
    }

    const admin = await User.findById(auth.admin._id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin record not found.' }, { status: 404 });
    }

    admin.firstName = firstName.trim();
    if (lastName !== undefined) admin.lastName = lastName.trim();
    if (phone !== undefined) admin.phone = phone.trim();
    if (city !== undefined) admin.city = city.trim();
    if (country !== undefined) admin.country = country.trim();

    await admin.save();

    await logAdminAction(
      admin.email,
      'ADMIN_PROFILE_UPDATED',
      'USER',
      admin.id,
      `Super Admin personal information updated. Name: ${admin.firstName} ${admin.lastName || ''}`,
      req
    );

    return NextResponse.json({
      success: true,
      message: 'Admin profile updated successfully!',
      profile: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        city: admin.city,
        country: admin.country,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update profile.' }, { status: 500 });
  }
}
