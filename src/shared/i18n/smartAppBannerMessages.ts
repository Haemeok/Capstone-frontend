import { smartAppBanner as en } from "./messages/en/smartAppBanner";
import { smartAppBanner as ja } from "./messages/ja/smartAppBanner";
import { smartAppBanner as ko } from "./messages/ko/smartAppBanner";
import type { Locale, SmartAppBannerDict } from "./types";

export const smartAppBannerMessages: Record<Locale, SmartAppBannerDict> = {
  ko,
  ja,
  en,
};
