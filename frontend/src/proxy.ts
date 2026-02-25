import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookieName } from '@/lib/utils';

// Matches API routes, static files, and standard next static files
const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the session cookie
  // The backend uses 'sessionId' by default, or '__Host-sessionId' in production
  const sessionId = request.cookies.get(getSessionCookieName())?.value;


  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!sessionId && !isPublicPath) {
    // If user is NOT logged in and trying to access a protected route (like /projects)
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionId && isPublicPath) {
    // If user IS logged in and trying to access login/signup
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  // Redirect root to projects or login
  if (pathname === '/') {
    if (sessionId) {
      return NextResponse.redirect(new URL('/projects', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
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
