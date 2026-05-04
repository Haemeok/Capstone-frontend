"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";

import {
  CURATION_CATEGORIES,
  CurationError,
  type GenerateCurationInput,
  type GenerateCurationOutput,
  type ToneSeed,
} from "@/entities/curation";
import { getRecipe } from "@/entities/recipe/model/api";

import {
  buildSlotInserterSystemPrompt,
  buildSlotInserterUserPrompt,
  buildSolarBodySystemPrompt,
  buildSolarBodyUserPrompt,
} from "@/app/admin/curation-test/lib/buildBodyPrompt";
import {
  buildTitleSystemPrompt,
  buildTitleUserPrompt,
  sampleFewShotTitles,
} from "@/app/admin/curation-test/lib/buildTitlePrompt";
import { findCommonIngredientNames } from "@/app/admin/curation-test/lib/commonIngredients";
import { hydrateMarkdown } from "@/app/admin/curation-test/lib/hydrate";
import { postProcessSelection } from "@/app/admin/curation-test/lib/postProcessSelection";
import { slugify } from "@/app/admin/curation-test/lib/slugify";
import { pickToneBySlug } from "@/app/admin/curation-test/lib/toneSeed";
import { validateMarkdown } from "@/app/admin/curation-test/lib/validate";

import { searchRecipeIds } from "./curation.search";

const xai = createOpenAI({
  name: "xai",
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY || "",
});

const openrouter = createOpenAI({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const MODEL_GROK = "grok-4-1-fast-reasoning";
const MODEL_SOLAR = "upstage/solar-pro-3";
const PROVIDER_LABEL = "solar-pro-3+grok-4-1-fast";

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
  if (!process.env.OPENROUTER_API_KEY) {
    throw new CurationError(
      "LLM_ERROR",
      "OPENROUTER_API_KEY가 설정되지 않았습니다.",
    );
  }
  return openrouter(MODEL_SOLAR);
};

const buildTitleSchema = (recipeCount: number, poolSize: number) =>
  z.object({
    h1: z.string().min(8).max(70),
    dek: z.string().min(20).max(120),
    category: z.enum(CURATION_CATEGORIES),
    selectedIndices: z
      .array(z.number().int().nonnegative())
      .length(recipeCount, {
        message: `selectedIndices 길이는 정확히 ${recipeCount} 이어야 합니다.`,
      })
      .refine((arr) => new Set(arr).size === arr.length, {
        message: "selectedIndices 는 중복 없는 unique 인덱스여야 합니다.",
      })
      .refine((arr) => arr.every((i) => i < poolSize), {
        message: `selectedIndices 의 모든 값은 0 이상 ${poolSize} 미만이어야 합니다.`,
      }),
  });

type TitleResult = z.infer<ReturnType<typeof buildTitleSchema>>;
const MAX_BODY_RETRIES = 2;

// generateText 결과가 ```markdown ... ``` fence로 감싸 오는 경우 벗긴다.
const stripCodeFence = (s: string): string => {
  const trimmed = s.trim();
  const m = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/);
  return m ? m[1].trim() : trimmed;
};

// Grok이 generateObject 출력에서 진짜 \n 대신 인라인 spaces로 단락을 끊어
// 한 덩어리 텍스트로 내는 케이스가 잦음. 시스템 프롬프트로 강제해도 안 지켜짐.
// 검증·hydrate 직전에 헤더 앞 spaces를 \n\n으로 바꿔 마크다운 구조를 복원한다.
const normalizeMarkdown = (md: string): string =>
  md
    // 헤더(`# `, `## `, `### `)가 라인 중간에 박혀있으면 앞에 \n\n 삽입
    .replace(/([^\n]) +(#{1,3} )/g, "$1\n\n$2")
    // 슬롯 뒤 spaces로 다음 단락이 이어지는 패턴도 \n\n으로 끊기
    .replace(/(\}\}) {2,}(?=\S)/g, "$1\n\n")
    // 끝쪽 trailing 공백 정리
    .trim();

export const generateCuration = async (
  input: GenerateCurationInput,
): Promise<GenerateCurationOutput> => {
  // Hybrid 고정: title/body Stage 3a는 Solar(한국어 자연체), Stage 3b는 Grok(슬롯 인서터).
  const solarModel = requireSolar();
  const grokModel = requireGrok();

  const recipeCount = input.recipeCount ?? 5;
  const POOL_MULTIPLIER = 2;
  const targetPoolSize = recipeCount * POOL_MULTIPLIER;
  const slug = slugify(input.params);
  const toneSeed: ToneSeed = input.forceToneSeed ?? pickToneBySlug(slug);

  // Stage 1: Fetch — recipeCount의 2배 풀을 가져와서 Title 단계가 가장 결속력 있는
  // N개를 고르도록 한다. 풀이 작으면 (3 미만) 큐레이션 자체를 포기.
  const poolIds = await searchRecipeIds(input.params, {
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
  const fewShots = sampleFewShotTitles(slug, 8);
  let titleObj: TitleResult;
  try {
    const { object } = await generateObject({
      model: solarModel,
      schema: buildTitleSchema(recipeCount, pool.length),
      system: buildTitleSystemPrompt({
        fewShots,
        count: recipeCount,
        poolSize: pool.length,
      }),
      prompt: buildTitleUserPrompt({
        params: input.params,
        recipeTitles: pool.map((r) => r.title),
        commonIngredients,
      }),
    });
    titleObj = object;
  } catch (e) {
    throw new CurationError(
      "LLM_ERROR",
      `Title 호출 실패: ${(e as Error).message}`,
    );
  }

  // LLM이 고른 인덱스를 검증·정규화해서 정확히 recipeCount개 (또는 pool.length가
  // 그보다 작으면 그 값) unique·valid 인덱스를 보장. 이후 Stage 3는 이 recipes만 사용.
  const finalIndices = postProcessSelection(
    titleObj.selectedIndices,
    recipeCount,
    pool.length,
  );
  const recipes = finalIndices.map((i) => pool[i]);

  // Stage 3: Body — Hybrid 고정.
  //   3a: Solar로 자연어 한국어 본문 (슬롯 없음)
  //   3b: Grok 슬롯 인서터 (단어/문장 보존, {{yt:N}}/{{recipe:N}}/{{img:N}}만 삽입)
  let bodyMarkdown = "";

  // Stage 3a
  let solarRawMd: string;
  try {
    const result = await generateText({
      model: solarModel,
      system: buildSolarBodySystemPrompt({ toneSeed }),
      prompt: buildSolarBodyUserPrompt({
        params: input.params,
        h1: titleObj.h1,
        dek: titleObj.dek,
        recipes,
        toneSeed,
        commonIngredients,
      }),
    });
    solarRawMd = result.text;
  } catch (e) {
    throw new CurationError(
      "LLM_ERROR",
      `Solar Body 호출 실패: ${(e as Error).message}`,
    );
  }

  // Stage 3b: Grok 슬롯 인서터 + retry/validate
  let lastErrors: string[] = [];
  for (let attempt = 0; attempt <= MAX_BODY_RETRIES; attempt++) {
    const userPrompt = buildSlotInserterUserPrompt({
      rawMarkdown: solarRawMd,
      recipes,
    });
    const finalUserPrompt =
      lastErrors.length > 0
        ? `${userPrompt}\n\n## 이전 시도에서 다음이 잘못되었습니다 — 반드시 수정하세요\n${lastErrors.map((e) => `- ${e}`).join("\n")}`
        : userPrompt;

    // generateText 사용 (schema X) — Solar 본문이 길거나 escape 어려운
    // 문자가 섞이면 generateObject의 JSON parse가 자주 깨진다. validateMarkdown이
    // 검증 책임이라 schema 중복.
    let insertedMd: string;
    try {
      const result = await generateText({
        model: grokModel,
        system: buildSlotInserterSystemPrompt(),
        prompt: finalUserPrompt,
      });
      insertedMd = stripCodeFence(result.text);
    } catch (e) {
      throw new CurationError(
        "LLM_ERROR",
        `Slot inserter 호출 실패: ${(e as Error).message}`,
      );
    }

    const normalized = normalizeMarkdown(insertedMd);
    const v = validateMarkdown(normalized, recipes.length);
    if (v.ok) {
      bodyMarkdown = normalized;
      break;
    }
    lastErrors = v.errors;
    console.warn(
      `[curation hybrid 3b] attempt ${attempt + 1} failed:\n${v.errors.map((e) => `  - ${e}`).join("\n")}\n  rawMarkdown(first 400): ${normalized.slice(0, 400)}`,
    );
    if (attempt === MAX_BODY_RETRIES) {
      throw new CurationError(
        "VALIDATION_FAILED",
        `Hybrid Stage 3b 검증 3회 실패\n${v.errors.map((e) => `- ${e}`).join("\n")}\n--- Solar raw (first 400) ---\n${solarRawMd.slice(0, 400)}\n--- Grok inserted (first 600) ---\n${normalized.slice(0, 600)}`,
        {
          errors: v.errors,
          solarRawMarkdown: solarRawMd,
          insertedMarkdown: normalized,
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
      youtubeChannelName: r.youtubeChannelName,
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
    provider: PROVIDER_LABEL,
    category: titleObj.category,
    coverImageKey: recipes[0]?.imageKey ?? null,
  };
};
