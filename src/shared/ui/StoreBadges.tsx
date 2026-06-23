"use client";

import { usePathname } from "next/navigation";

import { sendGAEvent } from "@next/third-parties/google";

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";
import { useIsApp } from "@/shared/hooks/useIsApp";
import type { Locale } from "@/shared/i18n";
import { resolveChromeLocale, useUiCommonDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

const APP_STORE_BADGE_BY_LOCALE: Record<Locale, string> = {
  ko: "/Download_on_the_App_Store_Badge_KR.svg",
  ja: "/Download_on_the_App_Store_Badge_JP_RGB_blk_100317.svg",
  en: "/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg",
};

const PLAY_STORE_BADGE_BY_LOCALE: Record<Locale, string> = {
  ko: "/GetItOnGooglePlay_Badge_Web_color_Korean.svg",
  ja: "/GetItOnGooglePlay_Badge_Web_color_Japanese.svg",
  en: "/GetItOnGooglePlay_Badge_Web_color_English.svg",
};

type StoreBadgesProps = {
  showAndroidNote?: boolean;
  className?: string;
};

export const StoreBadges = ({ className }: StoreBadgesProps) => {
  const isInApp = useIsApp();
  const t = useUiCommonDict();
  const locale = resolveChromeLocale(usePathname() ?? "/");

  if (isInApp) return null;

  const handleClick = (store: "app_store" | "google_play") => () => {
    triggerHaptic("Light");
    sendGAEvent("event", "app_open_click", { store, locale });
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick("app_store")}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <img
            src={APP_STORE_BADGE_BY_LOCALE[locale]}
            alt={t.store.appStoreAlt}
            className="h-14"
          />
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick("google_play")}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <img
            src={PLAY_STORE_BADGE_BY_LOCALE[locale]}
            alt={t.store.playStoreAlt}
            className="h-14"
          />
        </a>
      </div>
    </div>
  );
};
