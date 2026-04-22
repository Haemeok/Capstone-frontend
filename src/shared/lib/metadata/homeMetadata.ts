import type { Metadata } from "next";

import { SEO_CONSTANTS } from "./constants";

const HOME_DESCRIPTION =
  "YouTube 링크 하나로 레시피 저장, 30,000+ 홈쿡 레시피 · AI 맞춤 추천 · 홈파티·기념일·다이어트 상황별 레시피까지 한번에.";

const HOME_EXTRA_KEYWORDS = [
  "YouTube 레시피",
  "유튜브 레시피 추출",
  "유튜브 레시피 저장",
  "홈파티",
  "기념일 요리",
  "집들이 음식",
  "자취 요리",
  "다이어트 레시피",
  "냉장고 재료 레시피",
  "AI 레시피 추천",
];

export const homeMetadata: Metadata = {
  title: `${SEO_CONSTANTS.SITE_NAME} - AI가 추천하는 홈쿡 레시피`,
  description: HOME_DESCRIPTION,
  keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, ...HOME_EXTRA_KEYWORDS],
  verification: {
    other: {
      "naver-site-verification": "7c2a4d7a2d320196a11bcf8e31524a1827f41b99",
    },
  },
  alternates: {
    canonical: SEO_CONSTANTS.SITE_URL,
  },
  openGraph: {
    title: "레시피오",
    description: HOME_DESCRIPTION,
    url: "https://www.recipio.kr/",
    siteName: "레시피오 - recipio",
    images: [
      {
        url: "https://www.recipio.kr/og.png",
        width: 1200,
        height: 630,
        alt: "레시피오 - 홈쿡 레시피",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: SEO_CONSTANTS.TWITTER_CARD,
    title: `${SEO_CONSTANTS.SITE_NAME} - AI가 추천하는 홈쿡 레시피`,
    description: HOME_DESCRIPTION,
    images: [SEO_CONSTANTS.DEFAULT_IMAGE],
  },
};
