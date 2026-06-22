"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import type { UiCommonDict } from "./types";
import { uiCommonMessages } from "./uiCommonMessages";

export const useUiCommonDict = (): UiCommonDict =>
  uiCommonMessages[resolveChromeLocale(usePathname() ?? "/")];
