import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  // --- Allow static files, images, scripts, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // --- Allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // --- Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // If logged in and user visits /auth/login or /auth/register → redirect to dashboard
    if (
      token &&
      (pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/register"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  // --- Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Default allow all
  return NextResponse.next();
}

// Apply middleware only to these routes
export const config = {
  matcher: [
    "/auth/:path*",     // login, register, forgot-password, etc.
    "/dashboard/:path*", // protected area
    "/",                 // homepage
  ],
};
