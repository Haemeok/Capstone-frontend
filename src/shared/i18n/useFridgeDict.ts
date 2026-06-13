"use client";

import { usePathname } from "next/navigation";

import { fridgeMessages } from "./fridgeMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { FridgeDict } from "./types";

export const useFridgeDict = (): FridgeDict =>
  fridgeMessages[resolveChromeLocale(usePathname() ?? "/")];
