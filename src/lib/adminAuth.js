import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';

export async function verifyAdminSession(req) {
  const token = req.cookies.get('ticketx-token')?.value;
  if (!token) {
    return { authorized: false, response: NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 }) };
  }

  const payload = verifyJwt(token);
  if (!payload || (payload.role !== 'super_admin' && payload.role !== 'admin')) {
    return { authorized: false, response: NextResponse.json({ success: false, message: 'Unauthorized Admin access' }, { status: 403 }) };
  }

  await connectDB();
  const admin = await User.findById(payload.userId || payload.id);
  if (!admin || (admin.role !== 'super_admin' && admin.role !== 'admin') || admin.status === 'Suspended') {
    return { authorized: false, response: NextResponse.json({ success: false, message: 'Access revoked' }, { status: 403 }) };
  }

  return { authorized: true, admin };
}

export async function logAdminAction(adminEmail, action, targetType, targetId = '', details = '', req = null) {
  try {
    await connectDB();
    const ip = req?.headers?.get('x-forwarded-for') || req?.headers?.get('x-real-ip') || '';
    await AuditLog.create({
      adminEmail: adminEmail || 'superadmin@ticketx.com',
      action,
      targetType,
      targetId,
      details,
      ipAddress: ip
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
