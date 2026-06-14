"use client";

import { usePathname } from "next/navigation";

import { notFoundMessages } from "./notFoundMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { NotFoundDict } from "./types";

export const useNotFoundDict = (): NotFoundDict =>
  notFoundMessages[resolveChromeLocale(usePathname() ?? "/")];
