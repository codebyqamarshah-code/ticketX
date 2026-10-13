import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, comparePassword } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/;
    if (!specialCharRegex.test(newPassword)) {
      return NextResponse.json({ success: false, message: 'Password must contain at least one special character (!@#$%^&* etc.).' }, { status: 400 });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !user.resetPasswordOtpHash || !user.resetPasswordOtpExpiresAt) {
      return NextResponse.json({ success: false, message: 'No active password reset request found.' }, { status: 400 });
    }

    if (new Date() > user.resetPasswordOtpExpiresAt) {
      return NextResponse.json({ success: false, message: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    const isMatch = await comparePassword(cleanOtp, user.resetPasswordOtpHash);
    if (!isMatch) {
      user.resetPasswordAttempts += 1;
      await user.save();
      return NextResponse.json({ success: false, message: 'Invalid verification code.' }, { status: 400 });
    }

    // Set new password
    user.password = await hashPassword(newPassword);
    user.resetPasswordOtpHash = undefined;
    user.resetPasswordOtpExpiresAt = undefined;
    user.resetPasswordAttempts = 0;
    user.emailVerified = true; // Proves ownership of email
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully updated! You can now log in.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
