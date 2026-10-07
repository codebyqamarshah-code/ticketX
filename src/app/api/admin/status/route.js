import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const admin = await User.findOne({ role: 'super_admin' });
    
    // If we have an admin and they are verified, setup is complete
    const isSetup = admin ? true : false;
    
    return NextResponse.json({ success: true, isSetup });
  } catch (error) {
    console.error('Admin status error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
