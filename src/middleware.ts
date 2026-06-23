import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { localizedHref, stripLocale } from "@/shared/i18n/localizedHref";
import { type Locale, LOCALES } from "@/shared/i18n/types";

const isLocale = (value: string | undefined): value is Locale =>
  value !== undefined && (LOCALES as readonly string[]).includes(value);

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/") {
    const hasVisited = request.cookies.has("landing_visited");
    if (!hasVisited) {
      return NextResponse.redirect(new URL("/landing", request.url));
    }
  }

  const preferred = request.cookies.get(STORAGE_KEYS.PREFERRED_LOCALE)?.value;
  if (isLocale(preferred)) {
    const { barePath } = stripLocale(pathname);
    const target = localizedHref(barePath, preferred);
    if (target !== pathname) {
      return NextResponse.redirect(new URL(`${target}${search}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|ingest|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
