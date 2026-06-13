"use client";

import { usePathname } from "next/navigation";

import { getStoredLocale } from "./preferredLocale";
import { resolveLocaleFromPath } from "./resolveLocaleFromPath";
import type { Locale } from "./types";

export const useApiLocale = (): Locale =>
  resolveLocaleFromPath(usePathname() ?? "/") ?? getStoredLocale() ?? "ko";
