import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { get } from "@vercel/edge-config";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { localizedHref, stripLocale } from "@/shared/i18n/localizedHref";
import { type Locale, LOCALES } from "@/shared/i18n/types";
import { type Bloom, bloomHas } from "@/shared/lib/bloom";

const isLocale = (value: string | undefined): value is Locale =>
  value !== undefined && (LOCALES as readonly string[]).includes(value);

const RESERVED_RECIPE_SEGMENTS = new Set([
  "new",
  "my-fridge",
  "admin",
  "category",
  "private",
  "sitemap",
  "dyn",
]);

const resolveRecipeTrack = async (id: string): Promise<"isr" | "dynamic"> => {
  try {
    const bloom = await get<Bloom>("indexedBloom");
    if (bloom && bloomHas(bloom, id)) return "isr";
  } catch {
    // Edge Config unavailable (not provisioned / transient) → safe dynamic
  }
  return "dynamic";
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const preferred = request.cookies.get(STORAGE_KEYS.PREFERRED_LOCALE)?.value;
  if (isLocale(preferred)) {
    const { barePath } = stripLocale(pathname);
    const target = localizedHref(barePath, preferred);
    if (target !== pathname) {
      return NextResponse.redirect(new URL(`${target}${search}`, request.url));
    }
  }

  const segments = pathname.split("/");
  if (
    segments.length === 3 &&
    segments[1] === "recipes" &&
    !RESERVED_RECIPE_SEGMENTS.has(segments[2])
  ) {
    const id = segments[2];
    if ((await resolveRecipeTrack(id)) === "dynamic") {
      const url = request.nextUrl.clone();
      url.pathname = `/recipes/dyn/${id}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|ingest|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
