"use client";

import { usePathname } from "next/navigation";

import { commonMessages } from "./commonMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { CommonDict } from "./types";

export const useCommonDict = (): CommonDict =>
  commonMessages[resolveChromeLocale(usePathname() ?? "/")];
