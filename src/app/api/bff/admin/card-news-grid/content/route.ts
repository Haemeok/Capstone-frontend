import { NextRequest, NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, type LanguageModel } from "ai";

import { assertAdminApi } from "@/shared/lib/admin-guard";

import {
  itemsSchema,
  MAX_CAPTION,
  MAX_DISH_NAME,
  MAX_HEADER,
  topicsSchema,
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
};

const TOPICS_PROMPT = (seed?: string) =>
  `너는 한국 요리/식품 콘텐츠 기획자다. 인스타·블로그에서 저장과 클릭을 부르는 "요리팁 카드뉴스" 주제 후보 5개를 제안하라.` +
  (seed ? ` 시드 키워드: "${seed}".` : "") +
  ` 조건: 각 주제는 9개의 구체적인 음식/소스/조합으로 채울 수 있어야 한다.` +
  ` title은 뻔한 일반어 대신 구체적이고 후킹되는 롱테일 표현으로 (예: "실패 없는 김치찌개 황금레시피 Best 9"). concept은 한 줄 설명.` +
  ` 과장 광고체·이모지 남발 금지, 자연스러운 한국어.`;

const ITEMS_PROMPT = (topic: string) =>
  `주제 "${topic}"의 카드뉴스 본문을 작성하라. header 1개와 항목 9개를 생성한다.` +
  ` header: 주제를 그대로 복붙하지 말고 클릭하고 싶게 다듬은 후킹 타이틀 (${MAX_HEADER}자 이내).` +
  ` 각 항목 dishName: 일러스트로 그릴 구체적인 음식/메뉴명 (${MAX_DISH_NAME}자 이내). 너무 뻔한 것만 나열하지 말고 "이건 궁금하다" 싶은 구체적·특색 있는 선택을 섞어라.` +
  ` 각 항목 caption: 비율·수치만 건조하게 쓰지 말고 그게 왜 좋은지·어떤 맛인지를 곁들인 후킹 한 줄 (${MAX_CAPTION}자 이내, 사람 말투).` +
  ` 9개 정확히, 서로 겹치지 않게 다양하게. 과장 광고체·이모지 남발 금지. 한국어.`;

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

  try {
    const model = resolveModel(body.modelId);
    if (body.stage === "topics") {
      const { object } = await generateObject({
        model,
        schema: topicsSchema,
        prompt: TOPICS_PROMPT(body.seedKeyword),
      });
      return NextResponse.json(object);
    }
    const { object } = await generateObject({
      model,
      schema: itemsSchema,
      prompt: ITEMS_PROMPT(body.topicTitle as string),
    });
    return NextResponse.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
