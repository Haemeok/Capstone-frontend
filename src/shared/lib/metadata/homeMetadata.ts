import type { Metadata } from "next";

import { SEO_CONSTANTS } from "./constants";
import { createWebsiteStructuredData } from "./structuredData";

export const homeMetadata: Metadata = {
  title: `${SEO_CONSTANTS.SITE_NAME} - AI가 추천하는 홈쿡 레시피`,
  description: `AI가 추천하는 맛있는 홈쿡 레시피로 집에서 간편하게 요리해보세요. 이번주 인기 레시피와 홈파티 레시피까지!`,
  keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, "홈파티"],
  alternates: {
    canonical: SEO_CONSTANTS.SITE_URL,
  },
  openGraph: {
    title: `${SEO_CONSTANTS.SITE_NAME} - AI가 추천하는 홈쿡 레시피`,
    description: "AI가 추천하는 맛있는 홈쿡 레시피로 집에서 간편하게 요리해보세요.",
    url: SEO_CONSTANTS.SITE_URL,
    type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
    locale: SEO_CONSTANTS.LOCALE,
  },
  twitter: {
    card: SEO_CONSTANTS.TWITTER_CARD,
    title: `${SEO_CONSTANTS.SITE_NAME} - AI가 추천하는 홈쿡 레시피`,
    description: "AI가 추천하는 맛있는 홈쿡 레시피로 집에서 간편하게 요리해보세요.",
  },
  other: {
    "application/ld+json": JSON.stringify(createWebsiteStructuredData()),
  },
};