"use client";

import { usePathname } from "next/navigation";

import { navMessages } from "./navMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { Locale, NavDict } from "./types";

export const useChromeLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useChromeDict = (): NavDict => navMessages[useChromeLocale()];
