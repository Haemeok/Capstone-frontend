import type { Metadata } from "next";

import { SEO_CONSTANTS } from "./constants";

/**
 * YouTube Recipe Extractor Metadata
 *
 * SEO Strategy: Single-purpose tool optimization (inspired by converter/extractor sites)
 * - Clear value proposition in title
 * - Feature-rich description emphasizing unique capabilities
 * - Tool-focused structured data (WebApplication + HowTo schemas)
 * - Long-tail keyword coverage for various search intents
 * - Free + Korean market focus targeting underserved niche
 */

const YOUTUBE_EXTRACTOR_URL = `${SEO_CONSTANTS.SITE_URL}/recipes/new/youtube`;
const YOUTUBE_EXTRACTOR_IMAGE = `${SEO_CONSTANTS.SITE_URL}/web-app-manifest-512x512.png`;

// Primary and long-tail keywords for SEO
const YOUTUBE_EXTRACTOR_KEYWORDS = [
  // Primary Korean keywords
  "유튜브 레시피 추출",
  "유튜브 레시피 변환",
  "유튜브 요리 영상 레시피",
  "영상 레시피 만들기",
  "유튜브 쿠킹 레시피",
  "AI 레시피 분석",

  // Primary English keywords
  "YouTube recipe extractor",
  "YouTube to recipe converter",
  "extract recipe from YouTube",
  "YouTube cooking video to recipe",
  "recipe from video",
  "YouTube recipe analyzer",

  // Long-tail Korean keywords
  "유튜브 요리 영상 레시피로 저장",
  "YouTube 영상 레시피 추출 무료",
  "요리 유튜브 레시피 자동 생성",
  "유튜브 레시피 AI 분석",
  "쿠킹 영상 레시피 변환",
  "유튜브 요리 영상 텍스트로",

  // Feature-specific keywords
  "레시피 영양 성분 분석",
  "레시피 재료 가격 계산",
  "요리 타이머 레시피",
  "1인분 레시피 변환",

  // Brand keywords
  ...SEO_CONSTANTS.DEFAULT_KEYWORDS,
];

/**
 * WebApplication structured data
 * Marks this page as a utility tool for better search visibility
 */
const createWebApplicationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "유튜브 레시피 추출기 - YouTube Recipe Extractor",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  description: "유튜브 요리 영상에서 AI가 자동으로 레시피를 추출하고 영양 성분과 재료 가격을 분석합니다. 무료로 사용하세요!",
  url: YOUTUBE_EXTRACTOR_URL,
  provider: {
    "@type": "Organization",
    name: SEO_CONSTANTS.SITE_NAME,
    url: SEO_CONSTANTS.SITE_URL,
  },
  featureList: [
    "AI 기반 자동 레시피 추출",
    "영양 성분 및 칼로리 계산",
    "재료 가격 분석",
    "요리 타이머 통합",
    "1인분 변환 기능",
    "무료 서비스",
  ],
  browserRequirements: "Requires JavaScript. Requires HTML5.",
});

/**
 * HowTo structured data
 * Explains the extraction process for rich snippet display
 */
const createHowToStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "유튜브 요리 영상을 레시피로 변환하는 방법",
  description: "유튜브 요리 영상 링크만 있으면 AI가 자동으로 레시피를 추출하고 분석합니다.",
  totalTime: "PT2M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "KRW",
    value: "0",
  },
  step: [
    {
      "@type": "HowToStep",
      name: "유튜브 링크 복사",
      text: "추출하고 싶은 유튜브 요리 영상의 링크를 복사합니다.",
      position: 1,
      url: `${YOUTUBE_EXTRACTOR_URL}#step-1`,
    },
    {
      "@type": "HowToStep",
      name: "링크 붙여넣기",
      text: "복사한 유튜브 링크를 입력창에 붙여넣습니다.",
      position: 2,
      url: `${YOUTUBE_EXTRACTOR_URL}#step-2`,
    },
    {
      "@type": "HowToStep",
      name: "AI 분석 대기",
      text: "AI가 영상을 분석하여 레시피, 영양 성분, 재료 가격을 자동으로 추출합니다.",
      position: 3,
      url: `${YOUTUBE_EXTRACTOR_URL}#step-3`,
    },
    {
      "@type": "HowToStep",
      name: "레시피 저장 및 활용",
      text: "추출된 레시피를 저장하고 요리 타이머와 1인분 변환 기능을 활용합니다.",
      position: 4,
      url: `${YOUTUBE_EXTRACTOR_URL}#step-4`,
    },
  ],
  tool: [
    {
      "@type": "HowToTool",
      name: "유튜브 요리 영상 링크",
    },
  ],
});

/**
 * BreadcrumbList structured data
 * Provides navigation context for search engines
 */
const createBreadcrumbStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: SEO_CONSTANTS.SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "레시피 생성",
      item: `${SEO_CONSTANTS.SITE_URL}/recipes/new`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "유튜브 레시피 추출",
      item: YOUTUBE_EXTRACTOR_URL,
    },
  ],
});

/**
 * FAQPage structured data
 * Targets common questions for featured snippet opportunities
 */
const createFAQStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "유튜브 레시피 추출기는 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 완전 무료입니다. 유튜브 링크만 있으면 누구나 무료로 AI 기반 레시피 추출, 영양 성분 분석, 재료 가격 계산 기능을 사용할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 유튜브 영상에서 레시피를 추출할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "한국어로 진행되는 요리 영상이라면 대부분 추출 가능합니다. AI가 영상을 분석하여 재료, 조리 과정, 조리 시간 등을 자동으로 추출합니다.",
      },
    },
    {
      "@type": "Question",
      name: "추출된 레시피의 정확도는 어떤가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "최신 AI 기술을 활용하여 높은 정확도로 레시피를 추출합니다. 영양 성분 계산과 재료 가격 분석도 실시간 데이터를 기반으로 제공됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "추출된 레시피를 어떻게 활용할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "추출된 레시피는 바로 저장하여 요리할 때 사용할 수 있습니다. 요리 타이머 기능과 1인분 변환 기능도 함께 제공되어 실제 조리 시 편리하게 활용할 수 있습니다.",
      },
    },
  ],
});

/**
 * Combined structured data for the YouTube extractor page
 */
const createYoutubeExtractorStructuredData = () => {
  const webApp = createWebApplicationStructuredData();
  const howTo = createHowToStructuredData();
  const breadcrumb = createBreadcrumbStructuredData();
  const faq = createFAQStructuredData();

  return [webApp, howTo, breadcrumb, faq];
};

/**
 * YouTube Recipe Extractor Page Metadata
 *
 * Optimized for:
 * - Search queries: "유튜브 레시피 추출", "YouTube recipe extractor"
 * - Long-tail: "유튜브 요리 영상 레시피로 저장", "extract recipe from YouTube video"
 * - Tool discovery: Free utility tool positioning
 * - Rich snippets: Multiple structured data types
 */
export const youtubeExtractorMetadata: Metadata = {
  // Primary title optimized for click-through rate
  title: "유튜브 레시피 추출 - 무료 AI 영상 분석 | recipio",

  // Description emphasizing unique value props + CTA
  description:
    "유튜브 요리 영상에서 AI가 자동으로 레시피를 추출합니다. 영양 성분 계산, 재료 가격 분석, 요리 타이머까지! 100% 무료로 지금 바로 사용해보세요.",

  // Comprehensive keyword coverage
  keywords: YOUTUBE_EXTRACTOR_KEYWORDS,

  // Canonical URL for duplicate content prevention
  alternates: {
    canonical: YOUTUBE_EXTRACTOR_URL,
  },

  // OpenGraph for social media sharing
  openGraph: {
    title: "유튜브 레시피 추출기 - AI 자동 분석",
    description:
      "유튜브 요리 영상 링크만 붙여넣으면 AI가 레시피, 영양 성분, 재료 가격을 자동으로 분석합니다. 무료 서비스!",
    url: YOUTUBE_EXTRACTOR_URL,
    siteName: SEO_CONSTANTS.SITE_NAME,
    images: [
      {
        url: YOUTUBE_EXTRACTOR_IMAGE,
        width: 1200,
        height: 630,
        alt: "유튜브 레시피 추출기 - AI 기반 무료 도구",
      },
    ],
    locale: SEO_CONSTANTS.LOCALE,
    type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
  },

  // Twitter Card for Twitter/X sharing
  twitter: {
    card: SEO_CONSTANTS.TWITTER_CARD,
    title: "유튜브 레시피 추출 - 무료 AI 도구",
    description:
      "유튜브 요리 영상을 AI가 분석하여 레시피, 영양 성분, 재료 가격을 자동 추출합니다.",
    images: [YOUTUBE_EXTRACTOR_IMAGE],
  },

  // Robots directive for crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Multiple structured data types for rich snippets
  other: {
    "application/ld+json": JSON.stringify(
      createYoutubeExtractorStructuredData()
    ),
  },
};
