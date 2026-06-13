import type { Locale } from "@/shared/i18n";

import { HOME_BANNER_SLIDES } from "./slides";
import type { BannerSlide } from "./types";

const KO_ONLY_BANNER_IDS = new Set(["world-recipes", "ad-free-june"]);

export const selectHomeBannerSlides = (locale: Locale): BannerSlide[] =>
  locale === "ko"
    ? HOME_BANNER_SLIDES
    : HOME_BANNER_SLIDES.filter((s) => !KO_ONLY_BANNER_IDS.has(s.id));
