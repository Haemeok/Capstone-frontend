"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import { settingsMessages } from "./settingsMessages";
import type { SettingsDict } from "./types";

export const useSettingsDict = (): SettingsDict =>
  settingsMessages[resolveChromeLocale(usePathname() ?? "/")];
