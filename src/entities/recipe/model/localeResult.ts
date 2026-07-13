import {
  isErrorBody,
  type LocalizedResultMiss,
} from "@/shared/api/localizedResult";

import { toRecipe } from "./toRecipe";
import type { RawRecipeResponse, StaticRecipe } from "./types";

export type LocalizedRecipeResult =
  | { kind: "ok"; recipe: StaticRecipe }
  | LocalizedResultMiss;

export const parseLocalizedRecipeResult = (
  status: number,
  body: unknown
): LocalizedRecipeResult => {
  if (status >= 200 && status < 300) {
    // 200 본문은 평탄 raw — 클라이언트 경로와 동일하게 중첩 youtube로 정규화
    return {
      kind: "ok",
      recipe: toRecipe(body as RawRecipeResponse) as StaticRecipe,
    };
  }

  if (status === 404 && isErrorBody(body) && body.code === "213") {
    return { kind: "notTranslated", message: body.message ?? "" };
  }

  return { kind: "notFound" };
};
