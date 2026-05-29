import { NextRequest, NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, type LanguageModel } from "ai";

import { assertAdminApi } from "@/shared/lib/admin-guard";

import {
  normalizeItems,
  normalizeTopics,
} from "@/app/admin/card-news-grid/lib/normalize";
import {
  type CardMode,
  itemsGenSchema,
  MAX_CAPTION,
  MAX_DISH_NAME,
  MAX_HEADER,
  MAX_IMAGE_PROMPT,
  topicsGenSchema,
} from "@/app/admin/card-news-grid/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const OPENAI_PREFIX = "openai/";
const GOOGLE_PREFIX = "google/";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
const geminiStudio = createOpenAI({
  name: "gemini-studio",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_STUDIO_API_KEY || "",
});

const resolveModel = (modelId: string): LanguageModel => {
  if (modelId.startsWith(OPENAI_PREFIX)) {
    return openai(modelId.slice(OPENAI_PREFIX.length));
  }
  if (modelId.startsWith(GOOGLE_PREFIX)) {
    return geminiStudio.chat(modelId.slice(GOOGLE_PREFIX.length));
  }
  return modelId;
};

type Body = {
  stage?: "topics" | "items";
  modelId?: string;
  seedKeyword?: string;
  topicTitle?: string;
  mode?: CardMode;
};

const TOPICS_PROMPT = (mode: CardMode, seed?: string) => {
  const seedPart = seed ? ` 시드 키워드: "${seed}".` : "";
  if (mode === "tips") {
    return (
      `너는 실생활 꿀팁 콘텐츠 기획자다. 한 대상(과일·식재료·생활용품 등)에 대한 "고르는 법/보관법/손질법 9가지" 류의 카드뉴스 주제 후보 5개를 제안하라.` +
      seedPart +
      ` title은 구체적이고 후킹되는 롱테일 표현(예: "실패 없는 수박 고르는 법 9가지"), concept은 한 줄 설명.` +
      ` 과장 광고체·이모지 남발 금지, 자연스러운 한국어.`
    );
  }
  return (
    `너는 한국 요리/식품 콘텐츠 기획자다. 저장·클릭을 부르는 "요리팁 카드뉴스" 주제 후보 5개를 제안하라.` +
    seedPart +
    ` 각 주제는 9개의 구체적인 음식/소스/조합으로 채울 수 있어야 한다. title은 구체적·후킹 롱테일(예: "실패 없는 김치찌개 황금레시피 Best 9"), concept은 한 줄 설명.` +
    ` 과장 광고체·이모지 남발 금지, 자연스러운 한국어.`
  );
};

const ITEMS_PROMPT = (mode: CardMode, topic: string) => {
  const common =
    ` 정확히 9개, 서로 겹치지 않게 다양하게. 왼→오, 위→아래 순서로 정렬. 과장 광고체·이모지 남발 금지. 한국어.`;
  if (mode === "tips") {
    return (
      `주제 "${topic}"에 대한 실생활 꿀팁 카드뉴스 본문을 작성하라. header 1개와 항목 9개.` +
      ` header: 클릭하고 싶게 다듬은 후킹 타이틀 (${MAX_HEADER}자 이내).` +
      ` 각 항목 dishName: 그 팁을 한눈에 보여주는 짧은 라벨 (${MAX_DISH_NAME}자 이내).` +
      ` 각 항목 caption: 실제 꿀팁 설명 (${MAX_CAPTION}자 이내, 사람 말투).` +
      ` 각 항목 imagePrompt: 그 칸에 그릴 구체적 장면을 한 구절로 (${MAX_IMAGE_PROMPT}자 이내). 예: "꼭지가 갈색으로 마른 수박", "신문지에 싸인 사과". 9개가 서로 시각적으로 또렷이 구분되도록.` +
      common
    );
  }
  return (
    `주제 "${topic}"의 요리팁 카드뉴스 본문을 작성하라. header 1개와 항목 9개.` +
    ` header: 클릭하고 싶게 다듬은 후킹 타이틀 (${MAX_HEADER}자 이내).` +
    ` 각 항목 dishName: 구체적인 음식/메뉴명 (${MAX_DISH_NAME}자 이내). 너무 뻔한 것만 나열 말고 특색 있는 선택을 섞어라.` +
    ` 각 항목 caption: 비율·수치만 건조하게 말고 왜 좋은지·어떤 맛인지 곁들인 후킹 한 줄 (${MAX_CAPTION}자 이내, 사람 말투).` +
    ` 각 항목 imagePrompt: 그 음식을 그릴 장면 한 구절 (${MAX_IMAGE_PROMPT}자 이내). 보통 음식명이면 충분, 더 구체적이어도 좋음.` +
    common
  );
};

export async function POST(req: NextRequest) {
  const guardResponse = await assertAdminApi();
  if (guardResponse) return guardResponse;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.modelId) {
    return NextResponse.json({ error: "modelId is required" }, { status: 400 });
  }
  if (body.stage !== "topics" && body.stage !== "items") {
    return NextResponse.json({ error: "stage must be 'topics' or 'items'" }, { status: 400 });
  }
  if (body.stage === "items" && !body.topicTitle) {
    return NextResponse.json({ error: "topicTitle is required for items stage" }, { status: 400 });
  }

  const mode: CardMode = body.mode === "tips" ? "tips" : "recipe";

  try {
    const model = resolveModel(body.modelId);
    if (body.stage === "topics") {
      const { object } = await generateObject({
        model,
        schema: topicsGenSchema,
        prompt: TOPICS_PROMPT(mode, body.seedKeyword),
      });
      return NextResponse.json(normalizeTopics(object));
    }
    const { object } = await generateObject({
      model,
      schema: itemsGenSchema,
      prompt: ITEMS_PROMPT(mode, body.topicTitle as string),
    });
    return NextResponse.json(normalizeItems(object));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
