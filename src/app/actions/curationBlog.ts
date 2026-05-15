"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";

import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";
import type { StaticRecipe } from "@/entities/recipe/model/types";
import { requireAdminAction } from "@/shared/lib/admin-guard";

import {
  fetchCurationArticle,
  type PublicCurationArticleDto,
} from "@/features/curation/model/api.server";

import {
  buildCurationBlogBodySystemPrompt,
  buildCurationBlogBodyUserPrompt,
  buildCurationBlogMetaSystemPrompt,
  buildCurationBlogMetaUserPrompt,
} from "@/app/admin/recipe-blog-test/lib/buildCurationBlogPrompt";
import { buildCurationJsonLd } from "@/app/admin/recipe-blog-test/lib/buildCurationJsonLd";
import {
  type CurationBlogPost,
  CurationBlogMetaSchema,
} from "@/app/admin/recipe-blog-test/lib/curationBlogPost.schema";
import {
  normalizeMarkdown,
  stripCodeFence,
  validateCurationBlogMarkdown,
} from "@/app/admin/recipe-blog-test/lib/curationBlogBody";

const upstage = createOpenAI({
  name: "upstage",
  baseURL: "https://api.upstage.ai/v1",
  apiKey: process.env.UPSTAGE_API_KEY || "",
});

const MODEL_ID = "solar-pro3";
const MAX_BODY_RETRIES = 2;

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

export const generateCurationBlogPost = async (
  article: PublicCurationArticleDto,
  recipes: StaticRecipe[],
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

  // Stage 1: 본문 (generateText) — schema X. Markdown 출력 + 우리 쪽 토큰 검증.
  // generateObject 로 긴 본문 + 큰 schema 를 같이 강제하면 Upstage 500 이 자주 나서,
  // 큐레이션 코드(curation.ts)와 동일한 패턴으로 분리한다.
  let bodyMarkdown = "";
  let lastErrors: string[] = [];
  for (let attempt = 0; attempt <= MAX_BODY_RETRIES; attempt++) {
    let raw: string;
    try {
      const { text } = await generateText({
        model: solarModel,
        system: buildCurationBlogBodySystemPrompt(),
        prompt: buildCurationBlogBodyUserPrompt({
          article,
          recipes: usableRecipes,
          lastErrors,
        }),
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
    const v = validateCurationBlogMarkdown(normalized, {
      expectedRecipeIds: usableRecipes.map((r) => r.id),
      curationUrl,
    });
    if (v.ok) {
      bodyMarkdown = normalized;
      break;
    }
    lastErrors = v.errors;
    console.warn(
      `[curationBlog body] attempt ${attempt + 1} 검증 실패:\n${v.errors.map((e) => `  - ${e}`).join("\n")}`,
    );
    if (attempt === MAX_BODY_RETRIES) {
      return {
        success: false,
        error: `본문 검증 ${MAX_BODY_RETRIES + 1}회 실패: ${v.errors.join("; ")}`,
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
      system: buildCurationBlogMetaSystemPrompt(),
      prompt: buildCurationBlogMetaUserPrompt({
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
