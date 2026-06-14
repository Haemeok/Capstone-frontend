"use client";

import { usePathname } from "next/navigation";

import { ratingsMessages } from "./ratingsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { RatingsDict } from "./types";

export const useRatingsDict = (): RatingsDict =>
  ratingsMessages[resolveChromeLocale(usePathname() ?? "/")];
