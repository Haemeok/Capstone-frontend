import { NextRequest, NextResponse } from "next/server";

import { generateObject } from "ai";

import { assertAdminApi } from "@/shared/lib/admin-guard";

import { itemsSchema, topicsSchema } from "@/app/admin/card-news-grid/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  stage?: "topics" | "items";
  modelId?: string;
  seedKeyword?: string;
  topicTitle?: string;
};

const TOPICS_PROMPT = (seed?: string) =>
  `너는 한국 요리/식품 카드뉴스 기획자다. "황금비율 Best 9" 류의 요리팁 카드뉴스 주제 후보 5개를 제안하라.` +
  (seed ? ` 시드 키워드: "${seed}".` : "") +
  ` 각 주제는 9개의 한국 가정식/소스/조합으로 채울 수 있는 것이어야 한다. title은 짧고 후킹있게, concept은 한 줄 설명.`;

const ITEMS_PROMPT = (topic: string) =>
  `주제 "${topic}"에 맞는 카드뉴스 본문을 작성하라. header(주제 타이틀, 짧게)와 9개의 항목을 생성한다.` +
  ` 각 항목: dishName(음식/조합 이름, 14자 이내, 일러스트로 그릴 구체적 음식), caption(핵심 팁/비율, 40자 이내, 사람 말투).` +
  ` 정확히 9개. 한국어로.`;

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
    if (body.stage === "topics") {
      const { object } = await generateObject({
        model: body.modelId,
        schema: topicsSchema,
        prompt: TOPICS_PROMPT(body.seedKeyword),
      });
      return NextResponse.json(object);
    }
    const { object } = await generateObject({
      model: body.modelId,
      schema: itemsSchema,
      prompt: ITEMS_PROMPT(body.topicTitle as string),
    });
    return NextResponse.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
