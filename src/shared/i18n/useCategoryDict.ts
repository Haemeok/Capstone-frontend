"use client";

import { usePathname } from "next/navigation";

import { categoryMessages } from "./categoryMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { CategoryDict, Locale } from "./types";

export const useCategoryLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useCategoryDict = (): CategoryDict =>
  categoryMessages[useCategoryLocale()];
