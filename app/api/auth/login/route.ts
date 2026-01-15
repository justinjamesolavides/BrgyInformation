import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock user database - in production, use a real database
const users = [
  {
    id: 1,
    email: 'admin@brgy.com',
    password: 'demo123', // In production, hash passwords
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'staff@brgy.com',
    password: 'staff123',
    name: 'Staff User',
    role: 'staff'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user - in production, query database
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token (in production, use JWT or secure session)
    const sessionToken = `session_${user.id}_${Date.now()}`;

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Store session data (in production, use Redis or database)
    // For demo, we'll use a simple in-memory store
    global.sessionStore = global.sessionStore || new Map();
    global.sessionStore.set(sessionToken, {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      redirect: '/admin/dashboard'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}