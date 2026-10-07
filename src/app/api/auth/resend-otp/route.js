import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateOTP } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

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
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: false, message: 'Email is already verified' }, { status: 400 });
    }

    // Check cooldown (60 seconds)
    if (user.emailVerificationLastSentAt) {
      const now = new Date();
      const diffInSeconds = (now - user.emailVerificationLastSentAt) / 1000;
      if (diffInSeconds < 60) {
        return NextResponse.json({ success: false, message: `Please wait ${Math.ceil(60 - diffInSeconds)} seconds before resending.` }, { status: 429 });
      }
    }

    const otp = generateOTP();
    user.emailVerificationOtpHash = await hashPassword(otp);
    user.emailVerificationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    user.emailVerificationAttempts = 0;
    user.emailVerificationLastSentAt = new Date();
    await user.save();

    await sendVerificationEmail(cleanEmail, otp, user.role === 'super_admin');

    return NextResponse.json({ success: true, message: 'Verification code resent' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
