import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { TOTAL_RECIPE_COUNT_LABEL } from "@/shared/config/constants/siteStats";
import { buildHreflangAlternates, type Locale } from "@/shared/i18n";

import { SEO_CONSTANTS } from "./constants";

const LANDING_EXTRA_KEYWORDS = [
  "YouTube 레시피",
  "유튜브 레시피 추출",
  "유튜브 레시피 저장",
  "AI 레시피 추천",
  "냉장고 재료 레시피",
  "홈파티 레시피",
  "기념일 요리",
  "다이어트 레시피",
  "자취 요리",
];

type LocaleConfig = {
  title: string;
  description: string;
  ogLocale: string;
  canonical: string;
};

const getLocaleConfig = (locale: Locale): LocaleConfig => {
  if (locale === "ja") {
    return {
      title: `recipio - 10万+ 家庭料理レシピ・AIおすすめ`,
      description: `YouTubeリンクで保存、10万件以上の家庭料理。AIおすすめと、ホームパーティー・記念日・ダイエットまでシーン別レシピを一か所で。`,
      ogLocale: "ja_JP",
      canonical: absoluteUrl("ja/landing"),
    };
  }
  if (locale === "en") {
    return {
      title: `recipio - 100,000+ home recipes · AI picks`,
      description: `Save recipes from YouTube links. 100,000+ home recipes with AI recommendations and recipes for parties, anniversaries, and diets.`,
      ogLocale: "en_US",
      canonical: absoluteUrl("en/landing"),
    };
  }
  return {
    title: `${SEO_CONSTANTS.SITE_NAME} - ${TOTAL_RECIPE_COUNT_LABEL} 홈쿡 레시피 · AI 맞춤 추천`,
    description: `${TOTAL_RECIPE_COUNT_LABEL} 홈쿡 레시피, YouTube 링크 자동 추출, AI 맞춤 추천까지. 홈파티·기념일·다이어트 상황별 레시피를 한번에 찾아보세요.`,
    ogLocale: "ko_KR",
    canonical: absoluteUrl("landing"),
  };
};

export const buildLandingMetadata = (locale: Locale): Metadata => {
  const { title, description, ogLocale, canonical } = getLocaleConfig(locale);

  return {
    title,
    description,
    keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, ...LANDING_EXTRA_KEYWORDS],
    alternates: {
      canonical,
      languages: buildHreflangAlternates("landing"),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "레시피오 - recipio",
      images: [
        {
          url: SEO_CONSTANTS.DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: "레시피오 - 홈쿡 레시피",
        },
      ],
      locale: ogLocale,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [SEO_CONSTANTS.DEFAULT_IMAGE],
    },
  };
};

export const landingMetadata = buildLandingMetadata("ko");
