"use client";

import { usePathname } from "next/navigation";

import { appGlobalMessages } from "./appGlobalMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { AppGlobalDict } from "./types";

export const useAppGlobalDict = (): AppGlobalDict =>
  appGlobalMessages[resolveChromeLocale(usePathname() ?? "/")];
