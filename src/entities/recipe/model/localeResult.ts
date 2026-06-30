import {
  isErrorBody,
  type LocalizedResultMiss,
} from "@/shared/api/localizedResult";

import type { StaticRecipe } from "./types";

export type LocalizedRecipeResult =
  | { kind: "ok"; recipe: StaticRecipe }
  | LocalizedResultMiss;

export const parseLocalizedRecipeResult = (
  status: number,
  body: unknown
): LocalizedRecipeResult => {
  if (status >= 200 && status < 300) {
    // 200 본문은 StaticRecipe 그대로 — 검증은 호출부 책임
    return { kind: "ok", recipe: body as StaticRecipe };
  }

  if (status === 404 && isErrorBody(body) && body.code === "213") {
    return { kind: "notTranslated", message: body.message ?? "" };
  }

  return { kind: "notFound" };
};
