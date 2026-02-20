import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

/** 메이저 AI 봇 — 학습 + 검색/인용 모두 허용 (AI 답변에 레시피오 인용 → 무료 트래픽) */
const AI_MAJOR_BOTS = [
  // OpenAI (ChatGPT)
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Google (Gemini)
  "Google-Extended",
  "Gemini-Deep-Research",
  "Google-NotebookLM",
  // Anthropic (Claude)
  "ClaudeBot",
  "Claude-User",
  // xAI (Grok)
  "GrokBot",
  "xAI-Grok",
  "Grok-DeepSearch",
  // Perplexity
  "PerplexityBot",
  // DuckDuckGo
  "DuckAssistBot",
];

/** 가치 불명확하거나 스크래핑 목적 봇 — 차단 */
const AI_BLOCKED_BOTS = [
  // Meta
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  // ByteDance
  "Bytespider",
  // Common Crawl
  "CCBot",
  // 기타 스크래퍼
  "cohere-ai",
  "AI2Bot",
  "AI2Bot-Dolma",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Amazonbot",
  "Timpibot",
  "anthropic-ai",
  "GoogleOther",
  "GoogleOther-Image",
  "GoogleOther-Video",
  "Google-CloudVertexBot",
  "GoogleAgent-Mariner",
  "Applebot-Extended",
];

/** 비공개 경로 — 모든 크롤러 차단 */
const PRIVATE_PATHS = [
  "/api/",
  "/_next/",
  "/static/",
  "/login",
  "/login/error",
  "/users/edit",
  "/recipes/new",
  "/recipes/*/edit",
  "/recipes/*/rate",
  "/recipes/*/comments",
  "/notifications",
  "/calendar/*",
  "/ingredients/new",
];

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = SEO_CONSTANTS.SITE_URL;

  return {
    rules: [
      // 기본 규칙
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // 검색엔진 크롤러
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
      {
        userAgent: "Yeti",
        allow: "/",
        crawlDelay: 0,
      },
      // 메이저 AI 봇 허용 (레시피 인용/검색)
      {
        userAgent: AI_MAJOR_BOTS,
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // 스크래핑/저가치 봇 차단
      {
        userAgent: AI_BLOCKED_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
