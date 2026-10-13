import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyJwt } from '@/lib/auth';

export async function GET(req) {
  try {
    const token = req.cookies.get('ticketx-token')?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user || user.isDeleted) {
      const resp = NextResponse.json({ success: false, message: 'User not found or deactivated' }, { status: 404 });
      resp.cookies.set('ticketx-token', '', { expires: new Date(0), path: '/' });
      return resp;
    }

    if (user.status === 'Suspended') {
      const resp = NextResponse.json({ success: false, message: 'Account is suspended' }, { status: 403 });
      resp.cookies.set('ticketx-token', '', { expires: new Date(0), path: '/' });
      return resp;
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        city: user.city,
        country: user.country
      } 
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
