import { absoluteUrl, SITE_ORIGIN } from "./api";

export const SEO_CONSTANTS = {
  SITE_NAME: "레시피오",
  SITE_URL: SITE_ORIGIN,
  SITE_DESCRIPTION: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
  DEFAULT_IMAGE: absoluteUrl("og.png"),
  LOCALE: "ko_KR",
  TWITTER_CARD: "summary_large_image" as const,
  OG_TYPE: {
    WEBSITE: "website" as const,
    ARTICLE: "article" as const,
  },
} as const;

export const YOUTUBE_SEO = {
  SUBSCRIBER_THRESHOLDS: {
    FAMOUS: 100000,
    MEDIUM: 10000,
    MILLION: 1000000,
  },
} as const;
