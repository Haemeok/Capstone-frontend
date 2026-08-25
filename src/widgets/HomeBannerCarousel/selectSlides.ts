import type { Locale } from "@/shared/i18n";

import {
  APP_INSTALL_BANNER_ID,
  COOKING_RECORD_LAUNCH_BANNER_ID,
  HOME_BANNER_SLIDES,
} from "./slides";
import type { BannerSlide } from "./types";

const KO_ONLY_BANNER_IDS = new Set([
  APP_INSTALL_BANNER_ID,
  COOKING_RECORD_LAUNCH_BANNER_ID,
  "world-recipes",
  "ad-free-june",
]);

export const selectHomeBannerSlides = (locale: Locale): BannerSlide[] =>
  locale === "ko"
    ? HOME_BANNER_SLIDES
    : HOME_BANNER_SLIDES.filter((s) => !KO_ONLY_BANNER_IDS.has(s.id));
