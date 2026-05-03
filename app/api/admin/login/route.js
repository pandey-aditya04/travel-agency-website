import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { masterKey } = await req.json();
    const envMasterKey = process.env.ADMIN_MASTER_KEY;

    if (masterKey === envMasterKey) {
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

    return NextResponse.json({ success: false, message: 'Invalid Master Key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
