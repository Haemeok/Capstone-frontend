"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import type { Locale, YoutubeDict } from "./types";
import { youtubeMessages } from "./youtubeMessages";

export const useYoutubeLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useYoutubeDict = (): YoutubeDict =>
  youtubeMessages[useYoutubeLocale()];
