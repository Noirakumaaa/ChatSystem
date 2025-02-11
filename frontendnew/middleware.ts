import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth"); // Check if token exists
  const { pathname } = req.nextUrl;

  // If user is not logged in, prevent access to /a/* and redirect to /login
  if (!token && pathname.startsWith("/a/")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is logged in, prevent access to /, /login, and /register
  if (token && ["/", "/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/a/home", req.url));
  }

  return NextResponse.next(); // Allow access
}

// Apply middleware to these routes
export const config = {
 // matcher: ["/", "/login", "/register", "/a/:path*", "/api/r/:path*"], 
 matcher: ["/:path*"], 
};
