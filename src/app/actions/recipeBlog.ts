"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";

import { requireAdminAction } from "@/shared/lib/admin-guard";

import type { Recipe } from "@/entities/recipe/model/types";

import {
  type BlogPost,
  BlogPostMetaSchema,
} from "@/app/admin/recipe-blog-test/lib/blogPost.schema";
import {
  CLOSING_SEEDS,
  LEAD_SEEDS,
  pickSeedByRecipeId,
} from "@/app/admin/recipe-blog-test/lib/blogPostStyle";
import {
  buildBlogPostBodySystemPrompt,
  buildBlogPostBodyUserPrompt,
  buildBlogPostMetaSystemPrompt,
  buildBlogPostMetaUserPrompt,
  computePerServingMetrics,
} from "@/app/admin/recipe-blog-test/lib/buildBlogPostPrompt";
import { buildJsonLd } from "@/app/admin/recipe-blog-test/lib/buildJsonLd";
import {
  normalizeMarkdown,
  parseAndValidateRecipeBlogBody,
  stripCodeFence,
  synthesizeAlts,
} from "@/app/admin/recipe-blog-test/lib/recipeBlogBody";

const upstage = createOpenAI({
  name: "upstage",
  baseURL: "https://api.upstage.ai/v1",
  apiKey: process.env.UPSTAGE_API_KEY || "",
});

const MODEL_ID = "solar-pro3";
const MAX_BODY_RETRIES = 2;

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
  await requireAdminAction();

  if (!process.env.UPSTAGE_API_KEY) {
    return { success: false, error: "UPSTAGE_API_KEY가 설정되지 않았습니다." };
  }
  if (!recipe?.id) {
    return { success: false, error: "recipe.id가 없습니다." };
  }
  if (!recipe.steps || recipe.steps.length === 0) {
    return { success: false, error: "recipe.steps가 비어 있습니다." };
  }

  const leadSeed = pickSeedByRecipeId(LEAD_SEEDS, recipe.id);
  const closingSeed = pickSeedByRecipeId(CLOSING_SEEDS, recipe.id);

  const sortedSteps = recipe.steps
    .slice()
    .sort((a, b) => a.stepNumber - b.stepNumber);
  const expectedStepNumbers = sortedSteps.map((s) => s.stepNumber);
  const slots = opts?.imageSlots ?? [
    ...sortedSteps.map((s) => `step-${s.stepNumber}`),
    "final-plated",
  ];

  const metrics = computePerServingMetrics(recipe);
  const solarModel = upstage.chat(MODEL_ID);

  let bodyMarkdown = "";
  let parsedBody:
    | (ReturnType<typeof parseAndValidateRecipeBlogBody> & {
        ok: true;
      })
    | null = null;
  let lastErrors: string[] = [];

  for (let attempt = 0; attempt <= MAX_BODY_RETRIES; attempt++) {
    let raw: string;
    try {
      const { text } = await generateText({
        model: solarModel,
        system: buildBlogPostBodySystemPrompt(leadSeed, closingSeed),
        prompt: buildBlogPostBodyUserPrompt({
          recipe,
          metrics,
          lastErrors,
        }),
      });
      raw = text;
    } catch (error) {
      console.error("[recipeBlog] body generateText failed:", error);
      return {
        success: false,
        error: `본문 생성 실패: ${error instanceof Error ? error.message : String(error)}`,
      };
    }

    const normalized = normalizeMarkdown(stripCodeFence(raw));
    const v = parseAndValidateRecipeBlogBody(normalized, {
      expectedStepNumbers,
    });
    if (v.ok) {
      bodyMarkdown = normalized;
      parsedBody = v;
      break;
    }
    lastErrors = v.errors;
    console.warn(
      `[recipeBlog body] attempt ${attempt + 1} 검증 실패:\n${v.errors.map((e) => `  - ${e}`).join("\n")}`
    );
    if (attempt === MAX_BODY_RETRIES) {
      return {
        success: false,
        error: `본문 검증 ${MAX_BODY_RETRIES + 1}회 실패: ${v.errors.join("; ")}`,
      };
    }
  }

  if (!parsedBody) {
    return { success: false, error: "본문 파서 내부 상태 이상" };
  }

  // Stage 2: 메타 (generateObject) — schema 작고 정형이라 안전.
  let meta;
  try {
    const { object } = await generateObject({
      model: solarModel,
      schema: BlogPostMetaSchema,
      mode: "json",
      system: buildBlogPostMetaSystemPrompt(),
      prompt: buildBlogPostMetaUserPrompt({
        recipe,
        metrics,
        bodyMarkdown,
      }),
    });
    meta = object;
  } catch (error) {
    console.error("[recipeBlog] meta generateObject failed:", error);
    return {
      success: false,
      error: `메타 생성 실패: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  const alts = synthesizeAlts(recipe.title, slots);

  const post: BlogPost = {
    title: meta.title,
    lead: parsedBody.parsed.lead,
    steps: parsedBody.parsed.steps,
    kitchenTips: parsedBody.parsed.kitchenTips,
    appliedKnowledge: parsedBody.parsed.appliedKnowledge,
    bonusVariation: parsedBody.parsed.bonusVariation,
    closingNote: parsedBody.parsed.closingNote,
    nutritionBox: metrics,
    alts,
    captionForPlated: meta.captionForPlated,
    hashtags: meta.hashtags,
    jsonLd: buildJsonLd(recipe, metrics),
  };

  return {
    success: true,
    post,
    usedSeeds: { lead: leadSeed.id, closing: closingSeed.id },
  };
};
