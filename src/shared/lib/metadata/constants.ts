export const SEO_CONSTANTS = {
  SITE_NAME: "레시피오",
  SITE_URL: "https://www.recipio.kr",
  SITE_DESCRIPTION: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
  DEFAULT_KEYWORDS: ["레시피", "홈쿡", "AI추천", "요리", "집밥", "recipio"],
  DEFAULT_IMAGE: "https://www.recipio.kr/web-app-manifest-512x512.png",
  LOCALE: "ko_KR",
  TWITTER_CARD: "summary_large_image" as const,
  OG_TYPE: {
    WEBSITE: "website" as const,
    ARTICLE: "article" as const,
  },
} as const;

export const YOUTUBE_SEO = {
  KEYWORDS: [
    "유튜브 레시피",
    "유튜브 요리",
    "영상 레시피",
    "동영상 레시피",
    "요리 유튜브",
    "레시피 영상",
    "따라하기 쉬운 레시피",
    "영상으로 배우는 요리",
    "유튜브 맛집",
    "유튜버 추천 레시피",
  ],
  SUBSCRIBER_THRESHOLDS: {
    FAMOUS: 100000,
    MEDIUM: 10000,
    MILLION: 1000000,
  },
} as const;
