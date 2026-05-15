"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";

import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";
import type { StaticRecipe } from "@/entities/recipe/model/types";
import { requireAdminAction } from "@/shared/lib/admin-guard";

import {
  fetchCurationArticle,
  type PublicCurationArticleDto,
} from "@/features/curation/model/api.server";

import {
  type CurationBlogPost,
  CurationBlogPostSchema,
} from "@/app/admin/recipe-blog-test/lib/curationBlogPost.schema";
import {
  buildCurationBlogSystemPrompt,
  buildCurationBlogUserPrompt,
} from "@/app/admin/recipe-blog-test/lib/buildCurationBlogPrompt";
import { buildCurationJsonLd } from "@/app/admin/recipe-blog-test/lib/buildCurationJsonLd";

const upstage = createOpenAI({
  name: "upstage",
  baseURL: "https://api.upstage.ai/v1",
  apiKey: process.env.UPSTAGE_API_KEY || "",
});

const MODEL_ID = "solar-pro3";

export type FetchCurationArticleWithRecipesResult =
  | {
      success: true;
      article: PublicCurationArticleDto;
      recipes: StaticRecipe[];
      missingRecipeIds: string[];
    }
  | { success: false; error: string };

export const fetchCurationArticleWithRecipes = async (
  slug: string
): Promise<FetchCurationArticleWithRecipesResult> => {
  await requireAdminAction();

  const article = await fetchCurationArticle(slug);
  if (!article) {
    return { success: false, error: `큐레이션 글을 찾지 못했어요 (slug=${slug})` };
  }

  const settled = await Promise.all(
    article.recipeIds.map((id) => getStaticrecipionServer(id))
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
  recipes: StaticRecipe[]
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

  // 본문이 너무 길어지면 LLM 출력 품질이 떨어지므로 sections 상한을 8개로.
  // 자르고 남은 레시피들은 closingNote 의 /curation/{slug} 권유 링크가 흡수.
  const usableRecipes = recipes.slice(0, 8);

  const system = buildCurationBlogSystemPrompt();
  const prompt = buildCurationBlogUserPrompt(article, usableRecipes);

  try {
    const { object: narrative } = await generateObject({
      model: upstage.chat(MODEL_ID),
      schema: CurationBlogPostSchema,
      mode: "json",
      system,
      prompt,
    });

    const titleMap = new Map(recipes.map((r) => [r.id, r.title]));

    const post: CurationBlogPost = {
      ...narrative,
      curationSlug: article.slug,
      curationUrl: `https://recipio.kr/curation/${article.slug}`,
      jsonLd: buildCurationJsonLd(article, titleMap),
    };

    return { success: true, post };
  } catch (error) {
    console.error("[curationBlog] generateObject failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
};
