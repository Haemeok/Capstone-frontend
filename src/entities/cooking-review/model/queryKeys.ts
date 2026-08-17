import type { Locale } from "@/shared/i18n";

export const COOKING_REVIEW_QUERY_KEYS = {
  all: ["cooking-review"] as const,
  publicAll: ["cooking-review", "public"] as const,
  publicList: (recipeId: string, photoOnly: boolean, size: number) =>
    ["cooking-review", "public", recipeId, photoOnly, size] as const,
  myAll: ["cooking-review", "my"] as const,
  myList: (size: number, locale: Locale) =>
    ["cooking-review", "my", size, locale] as const,
};
