import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signJwt } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Missing email or OTP' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: false, message: 'Email is already verified' }, { status: 400 });
    }

    if (user.emailVerificationAttempts >= 5) {
      user.emailVerificationOtpHash = null;
      user.emailVerificationOtpExpiresAt = null;
      await user.save();
      return NextResponse.json({ success: false, message: 'Too many verification attempts. Please request a new code.' }, { status: 400 });
    }

    if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt) {
      return NextResponse.json({ success: false, message: 'No verification code found. Please request a new one.' }, { status: 400 });
    }

    if (new Date() > user.emailVerificationOtpExpiresAt) {
      return NextResponse.json({ success: false, message: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    const isValid = await comparePassword(otp, user.emailVerificationOtpHash);

    if (!isValid) {
      user.emailVerificationAttempts += 1;
      await user.save();
      return NextResponse.json({ success: false, message: 'Invalid verification code' }, { status: 400 });
    }

    // Success
    user.emailVerified = true;
    user.emailVerificationOtpHash = undefined;
    user.emailVerificationOtpExpiresAt = undefined;
    user.emailVerificationAttempts = 0;
    await user.save();

    // Create session (JWT)
    const token = signJwt({ userId: user._id, id: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } 
    });

    response.cookies.set('ticketx-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
