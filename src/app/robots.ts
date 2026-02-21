import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

/**
 * AI 검색/인용 봇 — 완전 허용
 * 사용자가 질문하면 실시간으로 웹을 검색해서 답변에 출처 링크를 달아주는 봇들.
 * 이 봇들이 접근해야 AI 답변에 recipio.kr이 인용됨 → 무료 트래픽 유입.
 */
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

/**
 * AI 학습용 크롤러 — 완전 차단
 * 사이트를 대량 크롤링해서 모델 학습 데이터로 사용.
 * 인용도 안 해주고 트래픽도 안 보내줌. 서버 리소스만 소모.
 */
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
      // 1. 기본 규칙 — 알려지지 않은 봇 포함 전체 허용 (비공개 경로만 차단)
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // 2. 검색엔진 크롤러 — 최우선 허용 (딜레이 없음)
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      // 3. AI 검색/인용 봇 — 허용 (AI 답변에 recipio.kr 인용 유도)
      {
        userAgent: AI_SEARCH_BOTS,
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // 4. AI 학습 크롤러 — 완전 차단 (콘텐츠 가져가기만 하고 트래픽 안 보내줌)
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}