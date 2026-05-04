"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";

import type { Recipe } from "@/entities/recipe/model/types";

import {
  type BlogPost,
  BlogPostSchema,
} from "@/app/admin/recipe-blog-test/lib/blogPost.schema";
import {
  CLOSING_SEEDS,
  LEAD_SEEDS,
  pickSeedByRecipeId,
} from "@/app/admin/recipe-blog-test/lib/blogPostStyle";
import {
  buildBlogPostSystemPrompt,
  buildBlogPostUserPrompt,
  computePerServingMetrics,
} from "@/app/admin/recipe-blog-test/lib/buildBlogPostPrompt";
import { buildJsonLd } from "@/app/admin/recipe-blog-test/lib/buildJsonLd";

const openrouter = createOpenAI({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const MODEL_ID = "upstage/solar-pro-3";

export type GenerateRecipeBlogPostResult =
  | {
      success: true;
      post: BlogPost;
      usedSeeds: { lead: string; closing: string };
    }
  | { success: false; error: string };

export const generateRecipeBlogPost = async (
  recipe: Recipe,
  opts?: { imageSlots?: string[] }
): Promise<GenerateRecipeBlogPostResult> => {
  if (!process.env.OPENROUTER_API_KEY) {
    return {
      success: false,
      error: "OPENROUTER_API_KEY가 설정되지 않았습니다.",
    };
  }
  if (!recipe?.id) {
    return { success: false, error: "recipe.id가 없습니다." };
  }
  if (!recipe.steps || recipe.steps.length === 0) {
    return { success: false, error: "recipe.steps가 비어 있습니다." };
  }

  const leadSeed = pickSeedByRecipeId(LEAD_SEEDS, recipe.id);
  const closingSeed = pickSeedByRecipeId(CLOSING_SEEDS, recipe.id);

  const slots =
    opts?.imageSlots ??
    [
      ...recipe.steps
        .slice()
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((s) => `step-${s.stepNumber}`),
      "final-plated",
    ];

  const metrics = computePerServingMetrics(recipe);
  const system = buildBlogPostSystemPrompt(leadSeed, closingSeed);
  const prompt = buildBlogPostUserPrompt(recipe, slots, metrics);

  try {
    const { object: narrative } = await generateObject({
      model: openrouter(MODEL_ID),
      schema: BlogPostSchema,
      mode: "json",
      system,
      prompt,
    });

    const post: BlogPost = {
      ...narrative,
      nutritionBox: metrics,
      jsonLd: buildJsonLd(recipe, metrics),
    };

    return {
      success: true,
      post,
      usedSeeds: { lead: leadSeed.id, closing: closingSeed.id },
    };
  } catch (error) {
    console.error("[recipeBlog] generateObject failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
};
