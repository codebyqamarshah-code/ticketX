import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateOTP, hashPassword, comparePassword, signJwt } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { verifyAdminSession, logAdminAction } from '@/lib/adminAuth';

export async function POST(req) {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const body = await req.json();
    const { action, newEmail, otp } = body;

    const admin = await User.findById(auth.admin._id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin account not found.' }, { status: 404 });
    }

    // STEP 1: REQUEST EMAIL CHANGE
    if (action === 'request') {
      if (!newEmail || !newEmail.includes('@')) {
        return NextResponse.json({ success: false, message: 'Please provide a valid new email address.' }, { status: 400 });
      }

      const cleanEmail = newEmail.trim().toLowerCase();
      if (cleanEmail === admin.email.toLowerCase()) {
        return NextResponse.json({ success: false, message: 'New email must be different from current email.' }, { status: 400 });
      }

      // Check if email already belongs to another user
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'This email is already in use by another account.' }, { status: 400 });
      }

      const generatedOtp = generateOTP();
      admin.pendingNewEmail = cleanEmail;
      admin.pendingEmailOtpHash = await hashPassword(generatedOtp);
      admin.pendingEmailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await admin.save();

      await sendVerificationEmail(cleanEmail, generatedOtp, true);

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${cleanEmail}. Check inbox to confirm.`
      });
    }

    // STEP 2: VERIFY AND COMMIT EMAIL CHANGE
    if (action === 'verify') {
      if (!newEmail || !otp) {
        return NextResponse.json({ success: false, message: 'Email and 6-digit OTP code are required.' }, { status: 400 });
      }

      const cleanEmail = newEmail.trim().toLowerCase();
      if (admin.pendingNewEmail !== cleanEmail) {
        return NextResponse.json({ success: false, message: 'Email does not match pending verification request.' }, { status: 400 });
      }

      if (!admin.pendingEmailOtpExpiresAt || new Date() > admin.pendingEmailOtpExpiresAt) {
        return NextResponse.json({ success: false, message: 'Verification code has expired. Please request a new one.' }, { status: 400 });
      }

      const isOtpValid = await comparePassword(otp, admin.pendingEmailOtpHash);
      if (!isOtpValid) {
        return NextResponse.json({ success: false, message: 'Invalid verification code.' }, { status: 400 });
      }

      const oldEmail = admin.email;
      admin.email = cleanEmail;
      admin.pendingNewEmail = undefined;
      admin.pendingEmailOtpHash = undefined;
      admin.pendingEmailOtpExpiresAt = undefined;
      await admin.save();

      await logAdminAction(
        cleanEmail,
        'ADMIN_EMAIL_CHANGED',
        'USER',
        admin.id,
        `Super Admin authorized email changed from ${oldEmail} to ${cleanEmail}.`,
        req
      );

      // Sign fresh JWT with updated email
      const token = signJwt({ userId: admin._id, id: admin.id, email: admin.email, role: admin.role });
      const response = NextResponse.json({
        success: true,
        message: 'Super Admin email address updated successfully!',
        newEmail: admin.email
      });

      response.cookies.set('ticketx-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Change email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to process email change.' }, { status: 500 });
  }
}
