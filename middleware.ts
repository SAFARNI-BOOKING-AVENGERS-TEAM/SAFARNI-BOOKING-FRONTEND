import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ─── Public paths — no auth required ───
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/tours",
  "/hotels",
  "/cars",
  "/flights",
  "/packages",
  "/esim",
  "/search",
];

// ─── Role-specific path prefixes ───
const PROVIDER_PATHS = [
  "/provider-dashboard",
  "/my-services",
  "/provider-bookings",
  "/earnings",
];

const ADMIN_PATHS = [
  "/admin-dashboard",
  "/admin-users",
  "/admin-providers",
  "/admin-services",
  "/admin-bookings",
  "/admin-audit",
];

const CUSTOMER_PATHS = [
  "/dashboard",
  "/bookings",
  "/favorites",
  "/profile",
  "/notifications",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets & API routes bypass middleware
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(?:png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // Public pages — allow everyone
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for access token in httpOnly cookie
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Token is valid — let the request through.
    // Role-based access is enforced by layout components
    // since the access token only contains { _id }, not role.
    // (Recommendation: add role to JWT payload in backend for edge-level role guards)

    return NextResponse.next();
  } catch {
    // Invalid or expired token
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.).*)"],
};