"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import type { Locale, UserPagesDict } from "./types";
import { userPagesMessages } from "./userPagesMessages";

export const useUserPagesLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useUserPagesDict = (): UserPagesDict =>
  userPagesMessages[useUserPagesLocale()];
