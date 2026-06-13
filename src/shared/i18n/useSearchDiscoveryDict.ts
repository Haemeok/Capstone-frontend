"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import { searchDiscoveryMessages } from "./searchDiscoveryMessages";
import type { Locale, SearchDiscoveryDict } from "./types";

export const useSearchDiscoveryLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useSearchDiscoveryDict = (): SearchDiscoveryDict =>
  searchDiscoveryMessages[useSearchDiscoveryLocale()];
