import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Email and verification code are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !user.resetPasswordOtpHash || !user.resetPasswordOtpExpiresAt) {
      return NextResponse.json({ success: false, message: 'No active password reset request found.' }, { status: 400 });
    }

    if (new Date() > user.resetPasswordOtpExpiresAt) {
      return NextResponse.json({ success: false, message: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    if (user.resetPasswordAttempts >= 5) {
      return NextResponse.json({ success: false, message: 'Too many incorrect attempts. Please request a new reset code.' }, { status: 400 });
    }

    const isMatch = await comparePassword(cleanOtp, user.resetPasswordOtpHash);
    if (!isMatch) {
      user.resetPasswordAttempts += 1;
      await user.save();
      const remainingAttempts = 5 - user.resetPasswordAttempts;
      return NextResponse.json({
        success: false,
        message: `Invalid code. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : 'Please request a new code.'}`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reset code verified successfully.'
    });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
