"use client";

import { useEffect } from "react";
// eslint-disable-next-line local/no-raw-router -- 이미 localizedHref로 prefix가 박힌 명시적 경로로 replace하므로 useLocalizedRouter의 재-prefix가 오히려 ko target을 깨뜨림
import { usePathname, useRouter } from "next/navigation";

import { getLocaleCookie, setLocaleCookie } from "./localeCookie";
import { localizedHref, stripLocale } from "./localizedHref";
import { getStoredLocale, setStoredLocale } from "./preferredLocale";
import { resolveChromeLocale } from "./resolveChromeLocale";
import { resolvePreferredLocale } from "./resolvePreferredLocale";
import { type Locale, LOCALES } from "./types";

const toLocale = (value: Locale | null): Locale | null =>
  value !== null && (LOCALES as readonly string[]).includes(value)
    ? value
    : null;

export const useLocalePreferenceSync = (account: Locale | null): void => {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const validAccount = toLocale(account);

  useEffect(() => {
    const resolved = resolvePreferredLocale({
      cookie: getLocaleCookie(),
      stored: getStoredLocale(),
      account: validAccount,
    });
    if (!resolved) return;

    if (getLocaleCookie() !== resolved) setLocaleCookie(resolved);
    if (getStoredLocale() !== resolved) setStoredLocale(resolved);

    if (resolveChromeLocale(pathname) !== resolved) {
      const { barePath } = stripLocale(pathname);
      router.replace(localizedHref(barePath, resolved));
    }
  }, [pathname, validAccount, router]);
};
