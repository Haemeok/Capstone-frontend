"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import { getRecipe } from "@/entities/recipe/model/api";
import {
  CurationError,
  type GenerateCurationInput,
  type GenerateCurationOutput,
  type ToneSeed,
} from "@/entities/curation";

import {
  buildBodySystemPrompt,
  buildBodyUserPrompt,
} from "@/app/admin/curation-test/lib/buildBodyPrompt";
import {
  buildTitleSystemPrompt,
  buildTitleUserPrompt,
  sampleFewShotTitles,
} from "@/app/admin/curation-test/lib/buildTitlePrompt";
import { hydrateMarkdown } from "@/app/admin/curation-test/lib/hydrate";
import { slugify } from "@/app/admin/curation-test/lib/slugify";
import { pickToneBySlug } from "@/app/admin/curation-test/lib/toneSeed";
import { validateMarkdown } from "@/app/admin/curation-test/lib/validate";

import { searchRecipeIds } from "./curation.search";

const xai = createOpenAI({
  name: "xai",
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY || "",
});
const MODEL_ID = "grok-4-1-fast-reasoning";

const TitleSchema = z.object({
  h1: z.string().min(8).max(70),
  dek: z.string().min(20).max(120),
});
const BodySchema = z.object({
  bodyMarkdown: z.string().min(800).max(5000),
});

const MAX_BODY_RETRIES = 2;

export const generateCuration = async (
  input: GenerateCurationInput,
): Promise<GenerateCurationOutput> => {
  if (!process.env.XAI_API_KEY) {
    throw new CurationError(
      "LLM_ERROR",
      "XAI_API_KEY가 설정되지 않았습니다.",
    );
  }

  const recipeCount = input.recipeCount ?? 5;
  const slug = slugify(input.params);
  const toneSeed: ToneSeed = input.forceToneSeed ?? pickToneBySlug(slug);

  // Stage 1: Fetch
  const recipeIds = await searchRecipeIds(input.params, {
    limit: recipeCount,
  });
  if (recipeIds.length < 3) {
    throw new CurationError(
      "INSUFFICIENT_RECIPES",
      "레시피가 3개 미만입니다.",
      {
        found: recipeIds.length,
        params: input.params,
      },
    );
  }
  const recipes = await Promise.all(recipeIds.map((id) => getRecipe(id)));

  // Stage 2: Title
  const fewShots = sampleFewShotTitles(slug, 8);
  let titleObj: { h1: string; dek: string };
  try {
    const { object } = await generateObject({
      model: xai(MODEL_ID),
      schema: TitleSchema,
      system: buildTitleSystemPrompt({ fewShots }),
      prompt: buildTitleUserPrompt({
        params: input.params,
        recipeTitles: recipes.map((r) => r.title),
      }),
    });
    titleObj = object;
  } catch (e) {
    throw new CurationError(
      "LLM_ERROR",
      `Title 호출 실패: ${(e as Error).message}`,
    );
  }

  // Stage 3: Body (with retry)
  let bodyMarkdown = "";
  let lastErrors: string[] = [];
  for (let attempt = 0; attempt <= MAX_BODY_RETRIES; attempt++) {
    const userPrompt = buildBodyUserPrompt({
      params: input.params,
      h1: titleObj.h1,
      dek: titleObj.dek,
      recipes,
      toneSeed,
    });
    const finalUserPrompt =
      lastErrors.length > 0
        ? `${userPrompt}\n\n## 이전 시도에서 다음이 잘못되었습니다 — 반드시 수정하세요\n${lastErrors.map((e) => `- ${e}`).join("\n")}`
        : userPrompt;

    let object: { bodyMarkdown: string };
    try {
      const result = await generateObject({
        model: xai(MODEL_ID),
        schema: BodySchema,
        system: buildBodySystemPrompt({ toneSeed }),
        prompt: finalUserPrompt,
      });
      object = result.object;
    } catch (e) {
      throw new CurationError(
        "LLM_ERROR",
        `Body 호출 실패: ${(e as Error).message}`,
      );
    }

    const v = validateMarkdown(object.bodyMarkdown, recipes.length);
    if (v.ok) {
      bodyMarkdown = object.bodyMarkdown;
      break;
    }
    lastErrors = v.errors;
    if (attempt === MAX_BODY_RETRIES) {
      throw new CurationError(
        "VALIDATION_FAILED",
        "Body 검증 3회 실패",
        {
          errors: v.errors,
          rawMarkdown: object.bodyMarkdown,
        },
      );
    }
  }

  const hydrated = hydrateMarkdown(
    bodyMarkdown,
    recipes.map((r) => ({
      id: r.id,
      title: r.title,
      imageUrl: r.imageUrl,
      youtubeUrl: r.youtubeUrl ?? "",
    })),
  );

  return {
    slug,
    h1: titleObj.h1,
    dek: titleObj.dek,
    markdown: hydrated,
    recipeIds: recipes.map((r) => r.id),
    toneSeed,
    thumbnailUrl: recipes[0]?.imageUrl ?? "",
  };
};
