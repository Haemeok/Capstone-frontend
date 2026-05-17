import type { LanguageModel } from "ai";
import { generateObject } from "ai";
import { z } from "zod";

import {
  CURATION_CATEGORIES,
  CurationError,
  type GenerateCurationInput,
} from "@/entities/curation";
import type { Recipe } from "@/entities/recipe";

import {
  buildTitleSystemPrompt,
  buildTitleUserPrompt,
  sampleFewShotTitles,
} from "@/app/admin/curation-test/lib/buildTitlePrompt";
import { logLLMError } from "@/app/admin/curation-test/lib/llmErrorDiagnostics";
import { validateTitleCount } from "@/app/admin/curation-test/lib/validateTitleCount";

const MAX_TITLE_RETRIES = 2;

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

export type CurationTitleResult = z.infer<ReturnType<typeof buildTitleSchema>>;

export type GenerateCurationTitleArgs = {
  solarModel: LanguageModel;
  params: GenerateCurationInput["params"];
  pool: Recipe[];
  commonIngredients: string[];
  recipeCount: number;
  slug: string;
};

export const generateCurationTitle = async ({
  solarModel,
  params,
  pool,
  commonIngredients,
  recipeCount,
  slug,
}: GenerateCurationTitleArgs): Promise<CurationTitleResult> => {
  const fewShots = sampleFewShotTitles(slug, 8);
  const titleSystem = buildTitleSystemPrompt({
    fewShots,
    count: recipeCount,
    poolSize: pool.length,
  });
  const titleUserBase = buildTitleUserPrompt({
    params,
    recipeTitles: pool.map((r) => r.title),
    commonIngredients,
    recipeCount,
  });
  const titleSchema = buildTitleSchema(recipeCount, pool.length);

  let titleObj: CurationTitleResult | null = null;
  let titleLastErrors: string[] = [];
  for (let attempt = 0; attempt <= MAX_TITLE_RETRIES; attempt++) {
    const titleUser =
      titleLastErrors.length > 0
        ? `${titleUserBase}\n\n## 이전 시도에서 다음이 잘못되었습니다 — 반드시 수정하세요\n${titleLastErrors.map((e) => `- ${e}`).join("\n")}`
        : titleUserBase;

    let candidate: CurationTitleResult;
    try {
      const { object } = await generateObject({
        model: solarModel,
        schema: titleSchema,
        mode: "json",
        system: titleSystem,
        prompt: titleUser,
      });
      candidate = object;
    } catch (e) {
      logLLMError(`title.attempt-${attempt + 1}`, e);
      titleLastErrors = [`schema 위반: ${(e as Error).message}`];
      console.warn(
        `[curation title] attempt ${attempt + 1} schema fail: ${(e as Error).message}`,
      );
      if (attempt === MAX_TITLE_RETRIES) {
        throw new CurationError(
          "LLM_ERROR",
          `Title 호출 실패 (${MAX_TITLE_RETRIES + 1}회 schema 위반): ${(e as Error).message}`,
        );
      }
      continue;
    }

    const titleCheck = validateTitleCount({
      h1: candidate.h1,
      dek: candidate.dek,
      expected: recipeCount,
    });
    if (titleCheck.ok) {
      titleObj = candidate;
      break;
    }
    titleLastErrors = titleCheck.errors;
    console.warn(
      `[curation title] attempt ${attempt + 1} count mismatch:\n${titleCheck.errors.map((e) => `  - ${e}`).join("\n")}\n  h1: ${candidate.h1}\n  dek: ${candidate.dek}`,
    );
    if (attempt === MAX_TITLE_RETRIES) {
      throw new CurationError(
        "VALIDATION_FAILED",
        `Title-Body N 일관성 검증 ${MAX_TITLE_RETRIES + 1}회 실패\n${titleCheck.errors.map((e) => `- ${e}`).join("\n")}`,
        { errors: titleCheck.errors, h1: candidate.h1, dek: candidate.dek },
      );
    }
  }

  if (!titleObj) {
    // 도달 불가 — 위 루프가 break/throw 둘 중 하나로 종료. TS narrowing 만족용.
    throw new CurationError("LLM_ERROR", "Title 결과를 얻지 못했습니다.");
  }

  return titleObj;
};
