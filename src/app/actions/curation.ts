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

    const normalized = normalizeMarkdown(object.bodyMarkdown);
    const v = validateMarkdown(normalized, recipes.length);
    if (v.ok) {
      bodyMarkdown = normalized;
      break;
    }
    lastErrors = v.errors;
    console.warn(
      `[curation] body attempt ${attempt + 1} failed validation:\n${v.errors.map((e) => `  - ${e}`).join("\n")}\n  rawMarkdown(first 400): ${normalized.slice(0, 400)}`,
    );
    if (attempt === MAX_BODY_RETRIES) {
      throw new CurationError(
        "VALIDATION_FAILED",
        `Body 검증 3회 실패\n${v.errors.map((e) => `- ${e}`).join("\n")}\n--- raw (first 600) ---\n${normalized.slice(0, 600)}`,
        {
          errors: v.errors,
          rawMarkdown: normalized,
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
