import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Publicly accessible routes
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Protected routes — add more here if needed
const PROTECTED_ROUTES = ['/dashboard'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const { pathname } = req.nextUrl;

  // 🚫 Block direct access to API routes (optional)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // ✅ Allow public routes (login/register) without token
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // If logged in, prevent visiting login/register again
    if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      const dashboardUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // 🔐 Protect private routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/auth/login', req.url);
      // Preserve the intended redirect after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ✅ Default: allow all other routes
  return NextResponse.next();
}

// ⚙️ Apply middleware only to app routes (not static files)
export const config = {
  matcher: [
    // Protect these routes
    '/dashboard/:path*',
    '/auth/:path*',
    '/',
  ],
};
