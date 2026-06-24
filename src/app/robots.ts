import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";

const AI_SEARCH_BOTS = [
  // OpenAI — ChatGPT 실시간 웹 브라우징 & 라이브 검색
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic — Claude 사용자 질문 시 실시간 웹 조회
  "Claude-User",
  "Claude-SearchBot",
  // Perplexity — 검색 색인 + 온디맨드 페이지 조회 (인용 링크 제공)
  "PerplexityBot",
  "Perplexity-User",
  // xAI — Grok 검색/심층검색 (UA 위장 이슈 있지만 명시해두는 게 안전)
  "xAI-Grok",
  "Grok-DeepSearch",
  // DuckDuckGo — AI 답변에 출처 인용 (학습 안 함 공식 명시)
  "DuckAssistBot",
  // You.com — AI 답변에 인라인 출처 링크 제공
  "YouBot",
  // Meta — Meta AI 어시스턴트 실시간 조회 (학습용 Meta-ExternalAgent와 별개)
  "Meta-ExternalFetcher",
  // Cohere — AI 채팅에서 사용자 질문 시 실시간 조회
  "cohere-ai",
];

const AI_TRAINING_BOTS = [
  // OpenAI — GPT 모델 학습 데이터 수집
  "GPTBot",
  // Anthropic — Claude 모델 학습 데이터 수집
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  // Google — Gemini/Bard AI 학습용 (구글 검색 색인과는 별개)
  "Google-Extended",
  "Google-CloudVertexBot",
  "GoogleOther",
  "GoogleOther-Image",
  "GoogleOther-Video",
  // Google — 에이전트/노트북 (학습 목적에 가까움)
  "GoogleAgent-Mariner",
  "Google-NotebookLM",
  // xAI — Grok 모델 학습 데이터 수집
  "GrokBot",
  // Apple — Apple Intelligence 학습 데이터 수집
  "Applebot-Extended",
  // Meta — Llama/Meta AI 학습 데이터 수집
  "Meta-ExternalAgent",
  "FacebookBot",
  // ByteDance — Doubao 등 모델 학습 (트래픽 매우 많음)
  "Bytespider",
  // Common Crawl — 오픈웹 아카이빙 (대부분의 AI 학습에 사용됨)
  "CCBot",
  // Amazon — Alexa 등 서비스용
  "Amazonbot",
  // Cohere — 모델 학습 전용 크롤러
  "cohere-training-data-crawler",
  // 기타 스크래퍼/데이터 수집
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Timpibot",
  "AI2Bot",
  "AI2Bot-Dolma",
  "Webzio-Extended",
  // DeepSeek
  "Deepseekbot",
];

/** 로케일 프리픽스 없이 항상 차단 */
const ALWAYS_PRIVATE = ["/api/", "/_next/", "/static/"];

/** 로케일 프리픽스 대상 비공개 경로 */
const PRIVATE_PATH_SUFFIXES = [
  "/login",
  "/login/error",
  "/users/",
  "/recipes/new",
  "/recipes/*/edit",
  "/recipes/*/rate",
  "/recipes/*/comments",
  "/recipes/*/remix",
  "/recipes/my-fridge",
  "/recipe-books",
  "/notifications",
  "/calendar/*",
  "/ingredients/new",
];

/** 지원 로케일 */
const LOCALE_PREFIXES = ["", "/en", "/ja"];

/** 비공개 경로 — 모든 크롤러 차단 */
const PRIVATE_PATHS = [
  ...ALWAYS_PRIVATE,
  ...LOCALE_PREFIXES.flatMap((prefix) =>
    PRIVATE_PATH_SUFFIXES.map((suffix) => `${prefix}${suffix}`)
  ),
];

/** 비공개 prefix 하위지만 크롤 허용해야 하는 공개 경로 (longest-match로 disallow보다 우선) */
const PUBLIC_PATH_SUFFIXES = ["/recipes/new/youtube"];

const PUBLIC_ALLOW = [
  "/",
  ...LOCALE_PREFIXES.flatMap((prefix) =>
    PUBLIC_PATH_SUFFIXES.map((suffix) => `${prefix}${suffix}`)
  ),
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: ["Googlebot", "Yeti", "Bingbot"],
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: [
      absoluteUrl("sitemap/0.xml"),
      absoluteUrl("recipes/sitemap/0.xml"),
      absoluteUrl("ingredients/sitemap/0.xml"),
      absoluteUrl("ja/recipes/sitemap/0.xml"),
      absoluteUrl("ja/ingredients/sitemap/0.xml"),
      absoluteUrl("en/recipes/sitemap/0.xml"),
      absoluteUrl("en/ingredients/sitemap/0.xml"),
    ],
  };
}
