import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { usersStorage } from '../../../../lib/fileStorage';

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

    // Find user from storage
    const user = usersStorage.findByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token (in production, use JWT or secure session)
    const sessionToken = `session_${user.id}_${Date.now()}`;

    // Store session data first (before setting cookie)
    global.sessionStore = global.sessionStore || new Map();
    global.sessionStore.set(sessionToken, {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date()
    });

    // Set redirect URL based on user role
    const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard';

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      redirect: redirectUrl
    });

    // Set session cookie on response
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}