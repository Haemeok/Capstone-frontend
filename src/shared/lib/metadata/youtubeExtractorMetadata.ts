import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n";

import { SEO_CONSTANTS } from "./constants";
import {
  alternateLocales,
  localizedPath,
  localizedSiteName,
  OG_LOCALE,
  YETI_INDEX,
} from "./localized";

const YOUTUBE_EXTRACTOR_IMAGE = absoluteUrl("web-app-manifest-512x512.png");

type HowToStepCopy = { name: string; text: string };

type LocaleCopy = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
  webAppName: string;
  webAppDescription: string;
  featureList: string[];
  howToName: string;
  howToDescription: string;
  howToSteps: HowToStepCopy[];
  breadcrumbLabels: [string, string, string];
};

const COPY: Record<Locale, LocaleCopy> = {
  ko: {
    metaTitle: "유튜브 레시피 추출 - 무료 AI 영상 분석 | recipio",
    metaDescription:
      "유튜브 요리 영상에서 AI가 자동으로 레시피를 추출합니다. 영양 성분 계산, 재료 가격 분석, 요리 타이머까지! 100% 무료로 지금 바로 사용해보세요.",
    ogTitle: "유튜브 레시피 추출기 - AI 자동 분석",
    ogDescription:
      "유튜브 요리 영상 링크만 붙여넣으면 AI가 레시피, 영양 성분, 재료 가격을 자동으로 분석합니다. 무료 서비스!",
    ogImageAlt: "유튜브 레시피 추출기 - AI 기반 무료 도구",
    twitterTitle: "유튜브 레시피 추출 - 무료 AI 도구",
    twitterDescription:
      "유튜브 요리 영상을 AI가 분석하여 레시피, 영양 성분, 재료 가격을 자동 추출합니다.",
    webAppName: "유튜브 레시피 추출기 - YouTube Recipe Extractor",
    webAppDescription:
      "유튜브 요리 영상에서 AI가 자동으로 레시피를 추출하고 영양 성분과 재료 가격을 분석합니다. 무료로 사용하세요!",
    featureList: [
      "AI 기반 자동 레시피 추출",
      "영양 성분 및 칼로리 계산",
      "재료 가격 분석",
      "요리 타이머 통합",
      "1인분 변환 기능",
      "무료 서비스",
    ],
    howToName: "유튜브 요리 영상을 레시피로 변환하는 방법",
    howToDescription:
      "유튜브 요리 영상 링크만 있으면 AI가 자동으로 레시피를 추출하고 분석합니다.",
    howToSteps: [
      {
        name: "유튜브 링크 복사",
        text: "추출하고 싶은 유튜브 요리 영상의 링크를 복사합니다.",
      },
      {
        name: "링크 붙여넣기",
        text: "복사한 유튜브 링크를 입력창에 붙여넣습니다.",
      },
      {
        name: "AI 분석 대기",
        text: "AI가 영상을 분석하여 레시피, 영양 성분, 재료 가격을 자동으로 추출합니다.",
      },
      {
        name: "레시피 저장 및 활용",
        text: "추출된 레시피를 저장하고 요리 타이머와 1인분 변환 기능을 활용합니다.",
      },
    ],
    breadcrumbLabels: ["홈", "레시피 생성", "유튜브 레시피 추출"],
  },

  en: {
    metaTitle: "YouTube Recipe Extractor — Free AI Video Analyzer | recipio",
    metaDescription:
      "Paste any YouTube cooking video link and our AI instantly pulls out the full recipe, nutrition facts, and ingredient costs. Free, no sign-up needed.",
    ogTitle: "YouTube Recipe Extractor — AI-Powered, Free",
    ogDescription:
      "Drop a YouTube link and get a structured recipe with nutrition info and price breakdown in seconds. Powered by AI, completely free.",
    ogImageAlt: "recipio YouTube Recipe Extractor — free AI tool",
    twitterTitle: "Extract Recipes from YouTube — Free AI Tool",
    twitterDescription:
      "AI reads your YouTube cooking video and outputs the full recipe, nutrition facts, and ingredient costs automatically.",
    webAppName: "YouTube Recipe Extractor — recipio",
    webAppDescription:
      "Automatically extract recipes, nutrition facts, and ingredient costs from any YouTube cooking video. Free to use.",
    featureList: [
      "AI-powered automatic recipe extraction",
      "Nutrition facts & calorie breakdown",
      "Ingredient cost analysis",
      "Built-in cooking timer",
      "Single-serving conversion",
      "Free service",
    ],
    howToName: "How to turn a YouTube cooking video into a recipe",
    howToDescription:
      "Just paste the YouTube link — our AI handles the rest and delivers a complete recipe in seconds.",
    howToSteps: [
      {
        name: "Copy the YouTube link",
        text: "Open the YouTube cooking video you want to convert and copy its URL.",
      },
      {
        name: "Paste the link",
        text: "Paste the copied YouTube URL into the input field on this page.",
      },
      {
        name: "Wait for AI analysis",
        text: "Our AI analyzes the video and automatically extracts the recipe, nutrition facts, and ingredient costs.",
      },
      {
        name: "Save and use your recipe",
        text: "Save the extracted recipe and use the built-in cooking timer and single-serving converter.",
      },
    ],
    breadcrumbLabels: ["Home", "Create Recipe", "YouTube Recipe Extractor"],
  },

  ja: {
    metaTitle: "YouTubeレシピ抽出 — 無料AIビデオ解析 | recipio",
    metaDescription:
      "YouTubeの料理動画URLを貼り付けるだけで、AIがレシピ・栄養成分・食材コストを自動で抽出します。完全無料、登録不要。",
    ogTitle: "YouTubeレシピ抽出ツール — AI自動解析、無料",
    ogDescription:
      "URLを貼るだけで構造化されたレシピと栄養情報・価格内訳を数秒で取得。AIが動画をまるごと解析します。",
    ogImageAlt: "recipio YouTubeレシピ抽出ツール — 無料AIサービス",
    twitterTitle: "YouTubeから無料でレシピ抽出 — AIツール",
    twitterDescription:
      "AIがYouTube料理動画を解析し、レシピ・栄養成分・食材コストをまとめて自動出力します。",
    webAppName: "YouTubeレシピ抽出ツール — recipio",
    webAppDescription:
      "YouTubeの料理動画からレシピ・栄養成分・食材コストを自動抽出。無料でご利用いただけます。",
    featureList: [
      "AI自動レシピ抽出",
      "栄養成分・カロリー計算",
      "食材コスト分析",
      "調理タイマー連携",
      "1人前換算機能",
      "無料サービス",
    ],
    howToName: "YouTubeの料理動画をレシピに変換する方法",
    howToDescription:
      "YouTubeのURLを貼るだけで、AIが自動的にレシピを抽出・解析します。",
    howToSteps: [
      {
        name: "YouTubeリンクをコピー",
        text: "抽出したいYouTube料理動画を開き、URLをコピーします。",
      },
      {
        name: "リンクを貼り付け",
        text: "コピーしたYouTube URLをページの入力欄に貼り付けます。",
      },
      {
        name: "AI解析を待つ",
        text: "AIが動画を解析し、レシピ・栄養成分・食材コストを自動で抽出します。",
      },
      {
        name: "レシピを保存して活用",
        text: "抽出されたレシピを保存し、調理タイマーや1人前換算機能を活用してください。",
      },
    ],
    breadcrumbLabels: ["ホーム", "レシピ作成", "YouTubeレシピ抽出"],
  },
};

const createWebApplicationStructuredData = (locale: Locale) => {
  const c = COPY[locale];
  const url = absoluteUrl(localizedPath(locale, "recipes/new/youtube"));
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.webAppName,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    description: c.webAppDescription,
    url,
    provider: {
      "@type": "Organization",
      name: localizedSiteName(locale),
      url: SEO_CONSTANTS.SITE_URL,
    },
    featureList: c.featureList,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
  };
};

const createHowToStructuredData = (locale: Locale) => {
  const c = COPY[locale];
  const base = absoluteUrl(localizedPath(locale, "recipes/new/youtube"));
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: c.howToName,
    description: c.howToDescription,
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "KRW",
      value: "0",
    },
    step: c.howToSteps.map((s, i) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
      position: i + 1,
      url: `${base}#step-${i + 1}`,
    })),
    tool: [
      {
        "@type": "HowToTool",
        name:
          locale === "ko"
            ? "유튜브 요리 영상 링크"
            : locale === "ja"
              ? "YouTube料理動画のリンク"
              : "YouTube cooking video link",
      },
    ],
  };
};

const createBreadcrumbStructuredData = (locale: Locale) => {
  const c = COPY[locale];
  const url = absoluteUrl(localizedPath(locale, "recipes/new/youtube"));
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: c.breadcrumbLabels[0],
        item: SEO_CONSTANTS.SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: c.breadcrumbLabels[1],
        item: absoluteUrl(localizedPath(locale, "recipes/new")),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: c.breadcrumbLabels[2],
        item: url,
      },
    ],
  };
};

export const createYoutubeExtractorStructuredData = (locale: Locale = "ko") => {
  return [
    createWebApplicationStructuredData(locale),
    createHowToStructuredData(locale),
    createBreadcrumbStructuredData(locale),
  ];
};

export const youtubeExtractorMetadata: Metadata = {
  title: COPY.ko.metaTitle,
  description: COPY.ko.metaDescription,
  alternates: {
    canonical: absoluteUrl("recipes/new/youtube"),
  },
  openGraph: {
    title: COPY.ko.ogTitle,
    description: COPY.ko.ogDescription,
    url: absoluteUrl("recipes/new/youtube"),
    siteName: SEO_CONSTANTS.SITE_NAME,
    images: [
      {
        url: YOUTUBE_EXTRACTOR_IMAGE,
        width: 1200,
        height: 630,
        alt: COPY.ko.ogImageAlt,
      },
    ],
    locale: SEO_CONSTANTS.LOCALE,
    type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
  },
  twitter: {
    card: SEO_CONSTANTS.TWITTER_CARD,
    title: COPY.ko.twitterTitle,
    description: COPY.ko.twitterDescription,
    images: [YOUTUBE_EXTRACTOR_IMAGE],
  },
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
};

export const buildYoutubeExtractorMetadata = (locale: Locale): Metadata => {
  const c = COPY[locale];
  const canonicalUrl = absoluteUrl(
    localizedPath(locale, "recipes/new/youtube")
  );
  return {
    ...youtubeExtractorMetadata,
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: buildHreflangAlternates("recipes/new/youtube"),
    },
    openGraph: {
      ...youtubeExtractorMetadata.openGraph,
      title: c.ogTitle,
      description: c.ogDescription,
      url: canonicalUrl,
      siteName: localizedSiteName(locale),
      images: [
        {
          url: YOUTUBE_EXTRACTOR_IMAGE,
          width: 1200,
          height: 630,
          alt: c.ogImageAlt,
        },
      ],
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocales(locale),
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: c.twitterTitle,
      description: c.twitterDescription,
      images: [YOUTUBE_EXTRACTOR_IMAGE],
    },
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
    other: YETI_INDEX,
  };
};
