import {
  isErrorBody,
  type LocalizedResultMiss,
} from "@/shared/api/localizedResult";

import type { IngredientDetailApiResponse } from "./types";

export type LocalizedIngredientResult =
  | { kind: "ok"; detail: IngredientDetailApiResponse }
  | LocalizedResultMiss;

export const parseLocalizedIngredientResult = (
  status: number,
  body: unknown
): LocalizedIngredientResult => {
  if (status >= 200 && status < 300) {
    // 200 본문은 IngredientDetailApiResponse 그대로 — 검증은 호출부(parseIngredientDetail) 책임
    return { kind: "ok", detail: body as IngredientDetailApiResponse };
  }
  if (status === 404 && isErrorBody(body) && body.code === "213") {
    return { kind: "notTranslated", message: body.message ?? "" };
  }
  return { kind: "notFound" };
};
