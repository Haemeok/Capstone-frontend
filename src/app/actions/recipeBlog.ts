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

const xai = createOpenAI({
  name: "xai",
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY || "",
});

const MODEL_ID = "grok-4-1-fast-reasoning";

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
  if (!process.env.XAI_API_KEY) {
    return { success: false, error: "XAI_API_KEY가 설정되지 않았습니다." };
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
    const { object } = await generateObject({
      model: xai(MODEL_ID),
      schema: BlogPostSchema,
      mode: "json",
      system,
      prompt,
    });

    return {
      success: true,
      post: object,
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
