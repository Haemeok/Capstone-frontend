import type { Metadata } from "next";

import { SEO_CONSTANTS } from "./constants";
import { createWebsiteStructuredData } from "./structuredData";

export const homeMetadata: Metadata = {
  title: `${SEO_CONSTANTS.SITE_NAME} - AI가 추천하는 홈쿡 레시피`,
  description: `AI가 추천하는 맛있는 홈쿡 레시피로 집에서 간편하게 요리해보세요. 이번주 인기 레시피와 홈파티 레시피까지!`,
  keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, "홈파티"],
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
    description: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 해먹어보세요!",
    url: "https://www.recipio.kr/",
    siteName: "레시피오 - recipio",
    images: [
      {
        url: "https://www.recipio.kr/back1.webp",
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
    description:
      "AI가 추천하는 맛있는 홈쿡 레시피로 집에서 간편하게 요리해보세요.",
    images: [SEO_CONSTANTS.DEFAULT_IMAGE],
  },
  other: {
    "application/ld+json": JSON.stringify(createWebsiteStructuredData()),
  },
};
