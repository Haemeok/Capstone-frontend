"use client";

import { usePathname } from "next/navigation";

import { cookingHelpMessages } from "./cookingHelpMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { CookingHelpDict, Locale } from "./types";

export const useCookingHelpLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useCookingHelpDict = (): CookingHelpDict =>
  cookingHelpMessages[useCookingHelpLocale()];
