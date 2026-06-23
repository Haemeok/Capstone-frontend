import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { TOTAL_RECIPE_COUNT_LABEL } from "@/shared/config/constants/siteStats";
import {
  buildHreflangAlternates,
  getDictionary,
  type Locale,
} from "@/shared/i18n";

import { SEO_CONSTANTS } from "./constants";
import { alternateLocales, localizedSiteName, OG_LOCALE } from "./localized";

// i18n-ignore
const HOME_DESCRIPTION = `YouTube 링크 하나로 레시피 저장, ${TOTAL_RECIPE_COUNT_LABEL} 홈쿡 레시피 · AI 맞춤 추천 · 홈파티·기념일·다이어트 상황별 레시피까지 한번에.`;

const HOME_EXTRA_KEYWORDS = [
  "YouTube 레시피", // i18n-ignore
  "유튜브 레시피 추출", // i18n-ignore
  "유튜브 레시피 저장", // i18n-ignore
  "홈파티", // i18n-ignore
  "기념일 요리", // i18n-ignore
  "집들이 음식", // i18n-ignore
  "자취 요리", // i18n-ignore
  "다이어트 레시피", // i18n-ignore
  "냉장고 재료 레시피", // i18n-ignore
  "AI 레시피 추천", // i18n-ignore
];

export const buildHomeMetadata = (locale: Locale): Metadata => {
  const m = getDictionary(locale).home.meta;
  const url = locale === "ko" ? SEO_CONSTANTS.SITE_URL : absoluteUrl(locale);
  const description = locale === "ko" ? HOME_DESCRIPTION : m.description;
  return {
    title: m.title,
    description,
    ...(locale === "ko" && {
      keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, ...HOME_EXTRA_KEYWORDS],
      verification: {
        other: {
          "naver-site-verification": "7c2a4d7a2d320196a11bcf8e31524a1827f41b99",
        },
      },
    }),
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(""),
    },
    openGraph: {
      title:
        locale === "ko" ? SEO_CONSTANTS.SITE_NAME : localizedSiteName(locale),
      description,
      url,
      siteName:
        locale === "ko"
          ? `${SEO_CONSTANTS.SITE_NAME} - recipio`
          : localizedSiteName(locale),
      images: [
        {
          url: SEO_CONSTANTS.DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: m.ogImageAlt,
        },
      ],
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocales(locale),
      type: "website",
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: m.title,
      description,
      images: [SEO_CONSTANTS.DEFAULT_IMAGE],
    },
  };
};
