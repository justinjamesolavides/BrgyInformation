import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken || !global.sessionStore) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const sessionData = global.sessionStore.get(sessionToken);

    if (!sessionData) {
      // Clear invalid session cookie
      cookieStore.set('session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });

      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: sessionData.userId,
        email: sessionData.email,
        name: sessionData.name,
        role: sessionData.role
      }
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}