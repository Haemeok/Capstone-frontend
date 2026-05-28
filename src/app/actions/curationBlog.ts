"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";

import { requireAdminAction } from "@/shared/lib/admin-guard";

import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";
import type { StaticRecipe } from "@/entities/recipe/model/types";

import {
  fetchCurationArticle,
  type PublicCurationArticleDto,
} from "@/features/curation/model/api.server";

import { assembleBlogBody } from "@/app/admin/recipe-blog-test/lib/assembleBlogBody";
import {
  buildToneSystemPrompt,
  buildToneUserPrompt,
} from "@/app/admin/recipe-blog-test/lib/blogTonePrompts";
import { buildCurationJsonLd } from "@/app/admin/recipe-blog-test/lib/buildCurationJsonLd";
import {
  normalizeMarkdown,
  stripCodeFence,
} from "@/app/admin/recipe-blog-test/lib/curationBlogBody";
import {
  CurationBlogMetaSchema,
  type CurationBlogPost,
} from "@/app/admin/recipe-blog-test/lib/curationBlogPost.schema";
import { parseBlogBody } from "@/app/admin/recipe-blog-test/lib/parseBlogBody";
import type { BlogTone } from "@/app/admin/recipe-blog-test/lib/toneInserts";

const upstage = createOpenAI({
  name: "upstage",
  baseURL: "https://api.upstage.ai/v1",
  apiKey: process.env.UPSTAGE_API_KEY || "",
});

const MODEL_ID = "solar-pro3";
const MAX_BODY_RETRIES = 1;

export type FetchCurationArticleWithRecipesResult =
  | {
      success: true;
      article: PublicCurationArticleDto;
      recipes: StaticRecipe[];
      missingRecipeIds: string[];
    }
  | { success: false; error: string };

export const fetchCurationArticleWithRecipes = async (
  slug: string,
): Promise<FetchCurationArticleWithRecipesResult> => {
  await requireAdminAction();

  const article = await fetchCurationArticle(slug);
  if (!article) {
    return { success: false, error: `큐레이션 글을 찾지 못했어요 (slug=${slug})` };
  }

  const settled = await Promise.all(
    article.recipeIds.map((id) => getStaticrecipionServer(id)),
  );

  const recipes: StaticRecipe[] = [];
  const missingRecipeIds: string[] = [];
  settled.forEach((r, i) => {
    if (r) recipes.push(r);
    else missingRecipeIds.push(article.recipeIds[i]);
  });

  return { success: true, article, recipes, missingRecipeIds };
};

export type GenerateCurationBlogPostResult =
  | { success: true; post: CurationBlogPost }
  | { success: false; error: string };

const buildMetaSystemPrompt = (): string => `당신은 한국 가정 식탁 블로그 글의 편집자다.
이미 작성된 블로그 본문을 보고, 그 본문 톤·내용에 어울리는 메타데이터(제목·해시태그·커버 캡션)를 JSON 으로 출력한다.

[출력 규칙]
- title.main: 60~90자 권장. 메뉴 주제 + 검색 키워드 4~5개 띄어쓰기. 광고체·자랑어("황금/실패없는/꿀팁") 금지.
- title.sub: 부제, 한 줄.
- hashtags: 8~10개. 메인 주제 1 + 변주 2~3 + 카테고리 1~2 + 식문화 1~2 + 계절·식탁 위치 1~2.
- captionForCover: 14~22자 명명형 (예: "환절기 한 그릇, 세 가지.").
- 본문의 종결어미·말투 결을 title.sub 와 captionForCover 에 자연스럽게 흡수.

위 zod 스키마(CurationBlogMetaSchema)에 맞춘 JSON 만 출력하라.`;

const buildMetaUserPrompt = (input: {
  article: PublicCurationArticleDto;
  recipes: StaticRecipe[];
  bodyMarkdown: string;
}): string => {
  const { article, recipes, bodyMarkdown } = input;
  const recipeBlock = recipes.map((r) => `- ${r.id}: ${r.title}`).join("\n");

  return `[큐레이션 원본]
slug: ${article.slug}
title(원본): ${article.title}
description(원본): ${article.description ?? ""}
category: ${article.category ?? ""}

[묶인 레시피들]
${recipeBlock}

[방금 작성된 블로그 본문]
${bodyMarkdown}

위 정보를 바탕으로 CurationBlogMetaSchema 에 맞춘 JSON 을 출력하라.`;
};

export const generateCurationBlogPost = async (
  article: PublicCurationArticleDto,
  recipes: StaticRecipe[],
  tone: BlogTone,
): Promise<GenerateCurationBlogPostResult> => {
  await requireAdminAction();

  if (!process.env.UPSTAGE_API_KEY) {
    return { success: false, error: "UPSTAGE_API_KEY가 설정되지 않았습니다." };
  }
  if (recipes.length < 3) {
    return {
      success: false,
      error: `리라이트에는 최소 3개의 살아있는 레시피가 필요해요 (현재 ${recipes.length}개)`,
    };
  }

  const usableRecipes = recipes.slice(0, 8);
  const curationUrl = `https://recipio.kr/curation/${article.slug}`;
  const solarModel = upstage.chat(MODEL_ID);

  const baseSystem = buildToneSystemPrompt(tone);
  const baseUser = buildToneUserPrompt({ article, recipes: usableRecipes });

  let bodyMarkdown = "";
  let lastErrors: string[] = [];
  for (let attempt = 0; attempt <= MAX_BODY_RETRIES; attempt++) {
    const userPrompt =
      attempt === 0
        ? baseUser
        : `${baseUser}

[이전 시도 실패 — 반드시 수정]
${lastErrors.map((e) => `- ${e}`).join("\n")}
- ## 헤딩은 정확히 ${usableRecipes.length}개. 마지막 ## 섹션 뒤에 \`---\` 한 줄 박을 것.`;

    let raw: string;
    try {
      const { text } = await generateText({
        model: solarModel,
        system: baseSystem,
        prompt: userPrompt,
      });
      raw = text;
    } catch (error) {
      console.error("[curationBlog] body generateText failed:", error);
      return {
        success: false,
        error: `본문 생성 실패: ${error instanceof Error ? error.message : String(error)}`,
      };
    }

    const normalized = normalizeMarkdown(stripCodeFence(raw));
    const parsed = parseBlogBody(normalized, usableRecipes.length);
    if (parsed.ok) {
      bodyMarkdown = assembleBlogBody(
        parsed.parsed,
        usableRecipes,
        tone,
        article.slug,
      );
      break;
    }
    lastErrors = parsed.errors;
    console.warn(
      `[curationBlog body] attempt ${attempt + 1} 파싱 실패:\n${parsed.errors.map((e) => `  - ${e}`).join("\n")}`,
    );
    if (attempt === MAX_BODY_RETRIES) {
      return {
        success: false,
        error: `본문 파싱 ${MAX_BODY_RETRIES + 1}회 실패: ${parsed.errors.join("; ")}`,
      };
    }
  }

  // Stage 2: 메타 (generateObject) — schema 작고 정형이라 안전.
  let meta;
  try {
    const { object } = await generateObject({
      model: solarModel,
      schema: CurationBlogMetaSchema,
      mode: "json",
      system: buildMetaSystemPrompt(),
      prompt: buildMetaUserPrompt({
        article,
        recipes: usableRecipes,
        bodyMarkdown,
      }),
    });
    meta = object;
  } catch (error) {
    console.error("[curationBlog] meta generateObject failed:", error);
    return {
      success: false,
      error: `메타 생성 실패: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  const titleMap = new Map(recipes.map((r) => [r.id, r.title]));

  // alts 는 LLM 이 안 만들고 우리가 합성 — recipe.title 그대로 alt 로.
  const alts: Record<string, string> = { cover: article.title };
  for (const r of usableRecipes) {
    alts[`recipe-${r.id}`] = r.title;
  }

  const post: CurationBlogPost = {
    ...meta,
    alts,
    bodyMarkdown,
    curationSlug: article.slug,
    curationUrl,
    jsonLd: buildCurationJsonLd(article, titleMap),
  };

  return { success: true, post };
};
