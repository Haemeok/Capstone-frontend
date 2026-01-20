import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const hasVisited = request.cookies.has("landing_visited");

    if (!hasVisited) {
      return NextResponse.redirect(new URL("/landing", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|ingest|_next/static|_next/image|favicon.ico|apple-touch-icon.png|manifest.json).*)",
  ],
};