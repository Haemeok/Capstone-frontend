"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import { smartAppBannerMessages } from "./smartAppBannerMessages";
import type { Locale, SmartAppBannerDict } from "./types";

export const useSmartAppBannerLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useSmartAppBannerDict = (): SmartAppBannerDict =>
  smartAppBannerMessages[useSmartAppBannerLocale()];
