"use server";

import { createOpenAI } from "@ai-sdk/openai";

import { requireAdminAction } from "@/shared/lib/admin-guard";

import {
  CurationError,
  type GenerateCurationInput,
  type GenerateCurationOutput,
  type ToneSeed,
} from "@/entities/curation";
import { getRecipe } from "@/entities/recipe/model/api";

import { findCommonIngredientNames } from "@/app/admin/curation-test/lib/commonIngredients";
import { computeWarnings } from "@/app/admin/curation-test/lib/computeWarnings";
import { hydrateMarkdown } from "@/app/admin/curation-test/lib/hydrate";
import { sanitizeQParam } from "@/app/admin/curation-test/lib/sanitizeQ";
import { slugify } from "@/app/admin/curation-test/lib/slugify";
import { pickToneBySlug } from "@/app/admin/curation-test/lib/toneSeed";

import { searchRecipeIds } from "./curation.search";
import { generateCurationBody } from "./curation/generateBody";
import { generateCurationTitle } from "./curation/generateTitle";

const xai = createOpenAI({
  name: "xai",
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY || "",
});

const upstage = createOpenAI({
  name: "upstage",
  baseURL: "https://api.upstage.ai/v1",
  apiKey: process.env.UPSTAGE_API_KEY || "",
});

const MODEL_GROK = "grok-4-1-fast-reasoning";
const MODEL_SOLAR = "solar-pro3";
const PROVIDER_LABEL = "solar-pro3+grok-4-1-fast";

const requireGrok = () => {
  if (!process.env.XAI_API_KEY) {
    throw new CurationError("LLM_ERROR", "XAI_API_KEY가 설정되지 않았습니다.");
  }
  return xai(MODEL_GROK);
};

const requireSolar = () => {
  if (!process.env.UPSTAGE_API_KEY) {
    throw new CurationError(
      "LLM_ERROR",
      "UPSTAGE_API_KEY가 설정되지 않았습니다."
    );
  }
  return upstage.chat(MODEL_SOLAR);
};

export const generateCuration = async (
  input: GenerateCurationInput
): Promise<GenerateCurationOutput> => {
  await requireAdminAction();

  // Hybrid 고정: title/body Stage 3a는 Solar(한국어 자연체), Stage 3b는 Grok(슬롯 인서터).
  const solarModel = requireSolar();
  const grokModel = requireGrok();

  const recipeCount = input.recipeCount ?? 5;
  const POOL_MULTIPLIER = 2;
  const targetPoolSize = recipeCount * POOL_MULTIPLIER;
  const slug = slugify(input.params);
  const toneSeed: ToneSeed = input.forceToneSeed ?? pickToneBySlug(slug);

  const sanitizedParams = sanitizeQParam(input.params);

  const poolIds = await searchRecipeIds(sanitizedParams, {
    limit: targetPoolSize,
  });
  if (poolIds.length < 3) {
    throw new CurationError(
      "INSUFFICIENT_RECIPES",
      "레시피가 3개 미만입니다.",
      {
        found: poolIds.length,
        params: input.params,
      }
    );
  }
  const pool = await Promise.all(poolIds.map((id) => getRecipe(id)));

  const commonIngredients = findCommonIngredientNames(pool);

  // Stage 2: Title (+ 풀에서 N개 선별)
  const titleObj = await generateCurationTitle({
    solarModel,
    params: sanitizedParams,
    pool,
    commonIngredients,
    recipeCount,
    slug,
  });

  const recipes = titleObj.selectedIndices.map((i) => pool[i]);

  const bodyMarkdown = await generateCurationBody({
    solarModel,
    grokModel,
    params: sanitizedParams,
    h1: titleObj.h1,
    dek: titleObj.dek,
    recipes,
    toneSeed,
    commonIngredients,
  });

  const hydrated = hydrateMarkdown(
    bodyMarkdown,
    recipes.map((r) => ({
      id: r.id,
      title: r.title,
      imageUrl: r.imageUrl,
      youtubeUrl: r.youtube?.url ?? "",
      youtubeChannelName: r.youtube?.channelName,
    }))
  );

  const warnings = computeWarnings({
    markdown: hydrated,
    params: sanitizedParams,
    recipes,
    expectedSectionCount: recipes.length,
  });

  return {
    slug,
    h1: titleObj.h1,
    dek: titleObj.dek,
    markdown: hydrated,
    recipeIds: recipes.map((r) => r.id),
    toneSeed,
    thumbnailUrl: recipes[0]?.imageUrl ?? "",
    provider: PROVIDER_LABEL,
    category: titleObj.category,
    coverImageKey: recipes[0]?.imageKey ?? null,
    warnings,
  };
};
