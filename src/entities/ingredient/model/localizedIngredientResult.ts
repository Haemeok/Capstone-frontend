import type { IngredientDetailApiResponse } from "./types";

export type LocalizedIngredientResult =
  | { kind: "ok"; detail: IngredientDetailApiResponse }
  | { kind: "notTranslated"; message: string }
  | { kind: "notFound" };

type ErrorBody = { code?: string; message?: string };

const isErrorBody = (body: unknown): body is ErrorBody =>
  typeof body === "object" && body !== null;

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
