import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateOTP } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json({ success: false, message: 'No registered account found with this email address.' }, { status: 404 });
    }

    if (user.status === 'Suspended') {
      return NextResponse.json({ success: false, message: 'This account has been suspended. Please contact support.' }, { status: 403 });
    }

    // Cooldown check (60 seconds)
    if (user.resetPasswordLastSentAt) {
      const now = new Date();
      const diffInSeconds = (now - user.resetPasswordLastSentAt) / 1000;
      if (diffInSeconds < 60) {
        return NextResponse.json({
          success: false,
          message: `Please wait ${Math.ceil(60 - diffInSeconds)} seconds before requesting a new code.`
        }, { status: 429 });
      }
    }

    const otp = generateOTP();
    user.resetPasswordOtpHash = await hashPassword(otp);
    user.resetPasswordOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    user.resetPasswordAttempts = 0;
    user.resetPasswordLastSentAt = new Date();
    await user.save();

    await sendPasswordResetEmail(cleanEmail, otp, user.role === 'super_admin');

    return NextResponse.json({
      success: true,
      message: 'Password reset code has been sent to your email address.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
