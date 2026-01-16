import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/admin', '/staff'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_token')?.value;

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Handle protected routes
  if (isProtectedRoute) {
    // If no session token, redirect to login
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Quick session validation - check if session exists in store
    if (global.sessionStore && sessionToken) {
      const session = global.sessionStore.get(sessionToken);
      if (!session) {
        // Invalid session, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Role-based route protection
      if (pathname.startsWith('/admin') && session.role !== 'admin') {
        return NextResponse.redirect(new URL('/staff/dashboard', request.url));
      }
      if (pathname.startsWith('/staff') && session.role !== 'staff') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  // Handle auth routes - redirect authenticated users to their dashboard
  if (isAuthRoute && sessionToken) {
    // Quick check for valid session to determine role
    if (global.sessionStore && sessionToken) {
      const session = global.sessionStore.get(sessionToken);
      if (session) {
        // Redirect based on role
        const redirectPath = session.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};