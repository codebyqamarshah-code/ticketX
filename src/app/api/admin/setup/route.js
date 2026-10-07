import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateOTP } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req) {
  try {
    await connectDB();
    const { firstName, email, password } = await req.json();

    if (!email || !password || !firstName) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if any super admin exists (ONLY ONE ALLOWED)
    const existingAdminCount = await User.countDocuments({ role: 'super_admin' });
    
    if (existingAdminCount > 0) {
      // If a super admin already exists, we do NOT allow another one to be created here.
      // But we can check if it's the exact SAME email trying to setup again but unverified.
      const existingAdmin = await User.findOne({ role: 'super_admin', email: cleanEmail });
      
      if (!existingAdmin) {
        return NextResponse.json({ success: false, message: 'A Super Admin already exists. Cannot create another.' }, { status: 403 });
      }

      if (existingAdmin.emailVerified) {
        return NextResponse.json({ success: false, message: 'Super Admin already exists and is verified. Please log in.' }, { status: 403 });
      }

      // If it's the SAME email and NOT verified, we just resend OTP
      const otp = generateOTP();
      existingAdmin.password = await hashPassword(password); // update password just in case
      existingAdmin.emailVerificationOtpHash = await hashPassword(otp);
      existingAdmin.emailVerificationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      existingAdmin.emailVerificationAttempts = 0;
      existingAdmin.emailVerificationLastSentAt = new Date();
      await existingAdmin.save();

      await sendVerificationEmail(cleanEmail, otp, true);
      return NextResponse.json({ success: true, message: 'Verification email sent' });
    }

    // Check if the email is already in the DB as a normal user
    let newAdmin = await User.findOne({ email: cleanEmail });

    if (newAdmin) {
      if (newAdmin.role !== 'super_admin') {
        // Upgrade this normal user to super admin since there is no super admin yet
        newAdmin.role = 'super_admin';
        newAdmin.firstName = firstName;
        newAdmin.password = await hashPassword(password);
      }
    } else {
      // Create entirely new user
      newAdmin = new User({
        id: `adm-${Date.now()}`,
        firstName: firstName,
        email: cleanEmail,
        role: 'super_admin',
        password: await hashPassword(password)
      });
    }

    const otp = generateOTP();
    newAdmin.emailVerificationOtpHash = await hashPassword(otp);
    newAdmin.emailVerificationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    newAdmin.emailVerificationAttempts = 0;
    newAdmin.emailVerificationLastSentAt = new Date();
    
    await newAdmin.save();
    
    await sendVerificationEmail(cleanEmail, otp, true);

    return NextResponse.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
