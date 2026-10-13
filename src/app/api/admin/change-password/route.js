import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, hashPassword } from '@/lib/auth';
import { verifyAdminSession, logAdminAction } from '@/lib/adminAuth';

export async function POST(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, message: 'All password fields are required.' }, { status: 400 });
    }

    const admin = await User.findById(auth.admin._id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin account not found.' }, { status: 404 });
    }

    // Verify current password
    const isCurrentValid = await comparePassword(currentPassword, admin.password);
    if (!isCurrentValid) {
      return NextResponse.json({ success: false, message: 'Incorrect current password.' }, { status: 400 });
    }

    // Validate new password rules
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: 'New password must be at least 8 characters long.' }, { status: 400 });
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/;
    if (!specialCharRegex.test(newPassword)) {
      return NextResponse.json({ success: false, message: 'New password must contain at least one special character (!@#$%^&* etc.).' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, message: 'New password and confirmation do not match.' }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ success: false, message: 'New password must be different from current password.' }, { status: 400 });
    }

    // Hash and save new password
    admin.password = await hashPassword(newPassword);
    await admin.save();

    await logAdminAction(
      admin.email,
      'ADMIN_PASSWORD_CHANGED',
      'USER',
      admin.id,
      'Super Admin master password successfully changed.',
      req
    );

    return NextResponse.json({
      success: true,
      message: 'Master password has been successfully updated!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ success: false, message: 'Failed to change password.' }, { status: 500 });
  }
}
