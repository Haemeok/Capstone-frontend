import { ApiError } from "@/shared/api/client";
import { getErrorData } from "@/shared/api/errors";
import type { Locale } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

export type RecipeBookError = { code: number | null; message: string };

export const FIELD_ERROR_CODES = new Set<number>([1104, 1107]);

export const getRecipeBookError = (
  error: unknown,
  locale: Locale
): RecipeBookError => {
  const errors = userPagesMessages[locale].recipeBooks.errors;
  if (error instanceof ApiError) {
    const code = getErrorData(error)?.code;
    if (typeof code === "number") {
      const message =
        code in errors
          ? // as: runtime numeric-literal key lookup on a typed dict object
            (errors as Record<number, string>)[code]
          : errors.fallback;
      return { code, message };
    }
  }
  return { code: null, message: errors.fallback };
};
