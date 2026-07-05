import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";
import { BASE_API_URL } from "@/shared/config/constants/api";
import type { TranslatedLocale } from "@/shared/i18n";

import {
  type LocalizedIngredientResult,
  parseLocalizedIngredientResult,
} from "./localeResult";
import type { IngredientDetailApiResponse } from "./types";

export const getIngredientDetailOnServer = async (
  id: string
): Promise<IngredientDetailApiResponse | null> => {
  const API_URL = `${BASE_API_URL}/ingredients/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.INGREDIENT_DETAIL,
        tags: [CACHE_TAGS.ingredientDetail(id)],
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as IngredientDetailApiResponse;
  } catch (error) {
    console.error(
      `[getIngredientDetailOnServer] Failed to fetch ingredient ${id}:`,
      error
    );
    return null;
  }
};

export const getLocalizedIngredientOnServer = async (
  id: string,
  locale: TranslatedLocale
): Promise<LocalizedIngredientResult> => {
  const url = new URL(`${BASE_API_URL}/ingredients/${encodeURIComponent(id)}`);
  url.searchParams.set("lang", locale);

  try {
    const res = await fetch(url.toString(), {
      next: {
        revalidate: REVALIDATION_TIMES.INGREDIENT_DETAIL,
        tags: [CACHE_TAGS.ingredientDetail(id)],
      },
    });
    const body = await res.json().catch(() => null);
    return parseLocalizedIngredientResult(res.status, body);
  } catch (error) {
    console.error(
      `[getLocalizedIngredientOnServer] Failed to fetch ingredient ${id} (${locale}):`,
      error
    );
    return { kind: "notFound" };
  }
};

const SITEMAP_FETCH_TIMEOUT_MS = 15000;

export const fetchAllIngredientsForSitemap = async (): Promise<
  Array<{ id: string; updatedAt: string }>
> => {
  const API_URL = `${BASE_API_URL}/ingredients/sitemap`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.INGREDIENTS_SITEMAP,
        tags: [CACHE_TAGS.ingredientsSitemap],
      },
      signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(
        `[fetchAllIngredientsForSitemap] API Error: ${res.status} ${res.statusText}`
      );
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(
      "[fetchAllIngredientsForSitemap] Failed to fetch ingredients:",
      error
    );
    return [];
  }
};
