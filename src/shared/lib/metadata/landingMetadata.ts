import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { TOTAL_RECIPE_COUNT_LABEL } from "@/shared/config/constants/siteStats";

import { SEO_CONSTANTS } from "./constants";

const LANDING_URL = absoluteUrl("landing");

const LANDING_DESCRIPTION = `${TOTAL_RECIPE_COUNT_LABEL} 홈쿡 레시피, YouTube 링크 자동 추출, AI 맞춤 추천까지. 홈파티·기념일·다이어트 상황별 레시피를 한번에 찾아보세요.`;

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

export const landingMetadata: Metadata = {
  title: `${SEO_CONSTANTS.SITE_NAME} - ${TOTAL_RECIPE_COUNT_LABEL} 홈쿡 레시피 · AI 맞춤 추천`,
  description: LANDING_DESCRIPTION,
  keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, ...LANDING_EXTRA_KEYWORDS],
  alternates: {
    canonical: LANDING_URL,
  },
  openGraph: {
    title: `${SEO_CONSTANTS.SITE_NAME} - ${TOTAL_RECIPE_COUNT_LABEL} 홈쿡 레시피`,
    description: LANDING_DESCRIPTION,
    url: LANDING_URL,
    siteName: "레시피오 - recipio",
    images: [
      {
        url: SEO_CONSTANTS.DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: "레시피오 - 홈쿡 레시피",
      },
    ],
    locale: SEO_CONSTANTS.LOCALE,
    type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
  },
  twitter: {
    card: SEO_CONSTANTS.TWITTER_CARD,
    title: `${SEO_CONSTANTS.SITE_NAME} - ${TOTAL_RECIPE_COUNT_LABEL} 홈쿡 레시피`,
    description: LANDING_DESCRIPTION,
    images: [SEO_CONSTANTS.DEFAULT_IMAGE],
  },
};
