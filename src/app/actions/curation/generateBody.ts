import type { LanguageModel } from "ai";
import { generateText } from "ai";

import {
  CurationError,
  type GenerateCurationInput,
  type ToneSeed,
} from "@/entities/curation";
import type { Recipe } from "@/entities/recipe";

import {
  buildSlotInserterSystemPrompt,
  buildSlotInserterUserPrompt,
  buildSolarBodySystemPrompt,
  buildSolarBodyUserPrompt,
} from "@/app/admin/curation-test/lib/buildBodyPrompt";
import { logLLMError } from "@/app/admin/curation-test/lib/llmErrorDiagnostics";
import { validateMarkdown } from "@/app/admin/curation-test/lib/validate";

const MAX_BODY_RETRIES = 2;

// generateText 결과가 ```markdown ... ``` fence로 감싸 오는 경우 벗긴다.
const stripCodeFence = (s: string): string => {
  const trimmed = s.trim();
  const m = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/);
  return m ? m[1].trim() : trimmed;
};

const normalizeMarkdown = (md: string): string =>
  md
    // 헤더(`# `, `## `, `### `)가 라인 중간에 박혀있으면 앞에 \n\n 삽입
    .replace(/([^\n]) +(#{1,3} )/g, "$1\n\n$2")
    // 슬롯 뒤 spaces로 다음 단락이 이어지는 패턴도 \n\n으로 끊기
    .replace(/(\}\}) {2,}(?=\S)/g, "$1\n\n")
    // 끝쪽 trailing 공백 정리
    .trim();

export type GenerateCurationBodyArgs = {
  solarModel: LanguageModel;
  grokModel: LanguageModel;
  params: GenerateCurationInput["params"];
  h1: string;
  dek: string;
  recipes: Recipe[];
  toneSeed: ToneSeed;
  commonIngredients: string[];
};

export const generateCurationBody = async ({
  solarModel,
  grokModel,
  params,
  h1,
  dek,
  recipes,
  toneSeed,
  commonIngredients,
}: GenerateCurationBodyArgs): Promise<string> => {
  // Stage 3a: Solar로 자연어 한국어 본문 (슬롯 없음)
  let solarRawMd: string;
  try {
    const result = await generateText({
      model: solarModel,
      system: buildSolarBodySystemPrompt({ toneSeed }),
      prompt: buildSolarBodyUserPrompt({
        params,
        h1,
        dek,
        recipes,
        toneSeed,
        commonIngredients,
      }),
    });
    solarRawMd = result.text;
  } catch (e) {
    logLLMError("solar-body", e);
    throw new CurationError(
      "LLM_ERROR",
      `Solar Body 호출 실패: ${(e as Error).message}`
    );
  }

  // Stage 3b: Grok 슬롯 인서터 + retry/validate
  let bodyMarkdown = "";
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

    let insertedMd: string;
    try {
      const result = await generateText({
        model: grokModel,
        system: buildSlotInserterSystemPrompt(),
        prompt: finalUserPrompt,
      });
      insertedMd = stripCodeFence(result.text);
    } catch (e) {
      logLLMError(`slot-inserter.attempt-${attempt + 1}`, e);
      throw new CurationError(
        "LLM_ERROR",
        `Slot inserter 호출 실패: ${(e as Error).message}`
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
      `[curation hybrid 3b] attempt ${attempt + 1} failed:\n${v.errors.map((e) => `  - ${e}`).join("\n")}\n  rawMarkdown(first 400): ${normalized.slice(0, 400)}`
    );
    if (attempt === MAX_BODY_RETRIES) {
      throw new CurationError(
        "VALIDATION_FAILED",
        `Hybrid Stage 3b 검증 3회 실패\n${v.errors.map((e) => `- ${e}`).join("\n")}\n--- Solar raw (first 400) ---\n${solarRawMd.slice(0, 400)}\n--- Grok inserted (first 600) ---\n${normalized.slice(0, 600)}`,
        {
          errors: v.errors,
          solarRawMarkdown: solarRawMd,
          insertedMarkdown: normalized,
        }
      );
    }
  }

  return bodyMarkdown;
};
