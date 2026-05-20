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
    throw new CurationError(
      "LLM_ERROR",
      "XAI_API_KEY가 설정되지 않았습니다.",
    );
  }
  return xai(MODEL_GROK);
};

const requireSolar = () => {
  if (!process.env.UPSTAGE_API_KEY) {
    throw new CurationError(
      "LLM_ERROR",
      "UPSTAGE_API_KEY가 설정되지 않았습니다.",
    );
  }
  return upstage.chat(MODEL_SOLAR);
};

export const generateCuration = async (
  input: GenerateCurationInput,
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

  // slug 계산 이후에만 적용 — 이미 raw q 로 발행된 기록과의 slug 매칭은 유지하면서
  // 검색/LLM/warnings 단계로 흘러가는 q 에서 보조어("레시피", "요리", "만드는법" 등)는 제거.
  const sanitizedParams = sanitizeQParam(input.params);

  // Stage 1: Fetch — recipeCount의 2배 풀을 가져와서 Title 단계가 가장 결속력 있는
  // N개를 고르도록 한다. 풀이 작으면 (3 미만) 큐레이션 자체를 포기.
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
      },
    );
  }
  const pool = await Promise.all(poolIds.map((id) => getRecipe(id)));

  // 모든 레시피에 공통으로 들어 있는 재료 이름. ingredientIds 같은 opaque 토큰
  // 대신 실재 공통 재료를 prompt에 박아 모델 환각(2/5 토마토→큐레이션이 토마토 테마)을 방지.
  // 풀 전체 기준 — 선별 후가 아닌 풀 기준이 더 안정적인 테마 시그널.
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

  // selectedIndices 의 length/unique/in-range 는 buildTitleSchema 가 zod refinement
  // 로 이미 보장. silent fixer 를 두면 모델이 약속을 어긴 사실이 뒤로 가려서
  // 타이틀-본문 N 어긋남이 새는 사고가 났음 — 이제는 약속을 어기면 retry 또는 fail.
  const recipes = titleObj.selectedIndices.map((i) => pool[i]);

  // Stage 3: Body — Hybrid 고정.
  //   3a: Solar로 자연어 한국어 본문 (슬롯 없음)
  //   3b: Grok 슬롯 인서터 (단어/문장 보존, {{yt:N}}/{{recipe:N}}/{{img:N}}만 삽입)
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
      youtubeUrl: r.youtubeUrl ?? "",
      youtubeChannelName: r.youtubeChannelName,
    })),
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
