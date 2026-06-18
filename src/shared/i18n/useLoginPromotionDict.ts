"use client";

import { usePathname } from "next/navigation";

import { loginPromotionMessages } from "./loginPromotionMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { Locale, LoginPromotionDict } from "./types";

export const useLoginPromotionLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useLoginPromotionDict = (): LoginPromotionDict =>
  loginPromotionMessages[useLoginPromotionLocale()];
