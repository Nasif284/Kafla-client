import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isProtectedTripRoute = pathname.startsWith("/trips");

  // If user is already authenticated and visits /login or /signup -> redirect to dashboard
  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL("/trips/groups", request.url));
  }

  // If user is not authenticated and visits a protected route -> redirect to login
  if (isProtectedTripRoute && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
