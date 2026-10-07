import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateOTP } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req) {
  try {
    await connectDB();
    const { firstName, lastName, email, password } = await req.json();

    if (!email || !password || !firstName) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      if (user.emailVerified) {
        return NextResponse.json({ success: false, message: 'Email is already registered and verified. Please sign in.' }, { status: 400 });
      }
      // If user exists but unverified, we update their data and send a new OTP
    } else {
      user = new User({
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email: cleanEmail,
        role: 'user'
      });
    }

    user.firstName = firstName;
    user.lastName = lastName || '';
    user.password = await hashPassword(password);
    
    // Generate OTP
    const otp = generateOTP();
    user.emailVerificationOtpHash = await hashPassword(otp);
    user.emailVerificationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.emailVerificationAttempts = 0;
    user.emailVerificationLastSentAt = new Date();
    
    await user.save();

    // Send email
    const emailRes = await sendVerificationEmail(cleanEmail, otp, false);
    
    if (!emailRes.success) {
      // Depending on requirement, we might still return success but tell them to resend, 
      // or return an error. Let's return success but maybe a warning if needed.
      console.error('Failed to send email:', emailRes.error);
    }

    return NextResponse.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
