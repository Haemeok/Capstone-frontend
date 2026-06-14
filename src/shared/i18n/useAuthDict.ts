"use client";

import { usePathname } from "next/navigation";

import { authMessages } from "./authMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { AuthDict } from "./types";

export const useAuthDict = (): AuthDict =>
  authMessages[resolveChromeLocale(usePathname() ?? "/")];
