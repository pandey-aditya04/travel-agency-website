import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const loginAttempts = new Map();

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  
  // Basic Rate Limiting: Max 5 attempts per 15 minutes
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  
  if (attempts.count >= 5 && (now - attempts.lastAttempt) < 15 * 60 * 1000) {
    return NextResponse.json({ 
      success: false, 
      message: 'Too many failed attempts. Please try again in 15 minutes.' 
    }, { status: 429 });
  }

  try {
    const { adminId, masterKey } = await req.json();
    const envAdminId = process.env.ADMIN_ID;
    const envMasterKey = process.env.ADMIN_MASTER_KEY;

    if (adminId === envAdminId && masterKey === envMasterKey) {
      const token = jwt.sign(
        { role: 'admin', authenticated: true },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
      
      // Set HttpOnly cookie
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/',
      });

      return response;
    }

    // Increment failed attempts
    loginAttempts.set(ip, { 
      count: attempts.count + 1, 
      lastAttempt: now 
    });

    return NextResponse.json({ success: false, message: 'Invalid Master Key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
