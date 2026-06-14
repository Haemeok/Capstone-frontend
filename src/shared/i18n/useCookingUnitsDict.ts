"use client";

import { usePathname } from "next/navigation";

import { cookingUnitsMessages } from "./cookingUnitsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { CookingUnitsDict, Locale } from "./types";

export const useCookingUnitsLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useCookingUnitsDict = (): CookingUnitsDict =>
  cookingUnitsMessages[useCookingUnitsLocale()];
