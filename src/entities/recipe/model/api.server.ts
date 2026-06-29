import { cookies } from "next/headers";

import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

import type { LocalizedRecipeResult } from "./localeResult";
import { parseLocalizedRecipeResult } from "./localeResult";
import { safeFetchJson } from "./safeFetchJson";
import {
  CategoryPopularResponse,
  CookedPopularResponse,
  CountryPopularResponse,
  DetailedRecipesApiResponse,
  QuickPopularResponse,
  Recipe,
  RecipeItemsQueryParams,
  RecipeStatus,
  SameIngredientResponse,
  SeasonalPopularResponse,
  StaticDetailedRecipeGridItem,
  StaticDetailedRecipesApiResponse,
  StaticRecipe,
  TitleKeywordResponse,
  TrendingYoutubeRecipe,
  YoutubeVerifiedResponse,
} from "./types";

const resolveSortParam = (
  sort: string | undefined,
  fallback: string
): string => {
  if (!sort) return fallback;
  return sort.includes(",") ? sort : `createdAt,${sort}`;
};

export const getRecipeStatusPublicOnServer = async (
  recipeId: string
): Promise<RecipeStatus | null> => {
  const API_URL = `${BASE_API_URL}/recipes/${recipeId}/status`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPE_DETAIL,
        tags: [CACHE_TAGS.recipe(recipeId)],
      },
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 401) return null;
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(
      `[getRecipeStatusPublicOnServer] Failed to fetch status ${recipeId}:`,
      error
    );
    return null;
  }
};

export const getRecipeStatusOnServer = async (
  recipeId: string
): Promise<RecipeStatus | null> => {
  const API_URL = `${BASE_API_URL}/recipes/${recipeId}/status`;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    const res = await fetch(API_URL, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(
      `[getRecipeStatusOnServer] Failed to fetch recipe status ${recipeId}:`,
      error
    );
    return null;
  }
};

export const getRecipesOnServer = async (
  params: RecipeItemsQueryParams
): Promise<DetailedRecipesApiResponse> => {
  const query = new URLSearchParams({
    page: String(params.page ?? 0),
    size: "10",
    sort: resolveSortParam(params.sort, "createdAt,desc"),
  });

  if (params.q) query.append("q", params.q);
  if (params.isAiGenerated) query.append("isAiGenerated", "true");
  if (params.dishType) query.append("dishType", params.dishType);
  if (params.tags && params.tags.length > 0) {
    query.set("tags", params.tags.join(","));
  }
  if (params.types && params.types.length > 0) {
    query.set("types", params.types.join(","));
  }
  if (params.ingredientIds && params.ingredientIds.length > 0) {
    query.set("ingredientIds", params.ingredientIds.join(","));
  }
  if (params.maxCost !== undefined)
    query.append("maxCost", params.maxCost.toString());
  if (params.minCost !== undefined)
    query.append("minCost", params.minCost.toString());
  if (params.period) query.append("period", params.period);
  if (params.lang) query.append("lang", params.lang);

  if (params.minCalories !== undefined)
    query.append("minCalories", params.minCalories.toString());
  if (params.maxCalories !== undefined)
    query.append("maxCalories", params.maxCalories.toString());
  if (params.minCarb !== undefined)
    query.append("minCarb", params.minCarb.toString());
  if (params.maxCarb !== undefined)
    query.append("maxCarb", params.maxCarb.toString());
  if (params.minProtein !== undefined)
    query.append("minProtein", params.minProtein.toString());
  if (params.maxProtein !== undefined)
    query.append("maxProtein", params.maxProtein.toString());
  if (params.minFat !== undefined)
    query.append("minFat", params.minFat.toString());
  if (params.maxFat !== undefined)
    query.append("maxFat", params.maxFat.toString());
  if (params.minSugar !== undefined)
    query.append("minSugar", params.minSugar.toString());
  if (params.maxSugar !== undefined)
    query.append("maxSugar", params.maxSugar.toString());
  if (params.minSodium !== undefined)
    query.append("minSodium", params.minSodium.toString());
  if (params.maxSodium !== undefined)
    query.append("maxSodium", params.maxSodium.toString());

  let endpoint = END_POINTS.RECIPE_SEARCH;

  if (params.key === "budget-recipes") {
    endpoint = END_POINTS.RECIPE_BUDGET;
  } else if (params.key === "popular-recipes") {
    endpoint = END_POINTS.RECIPE_POPULAR;
  }

  const API_URL = `${BASE_API_URL}${endpoint}?${query.toString()}`;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    const res = await fetch(API_URL, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`[getRecipesOnServer] Failed to fetch recipes:`, error);

    return {
      content: [],
      page: {
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }
};

export const getrecipionServer = async (id: string): Promise<Recipe | null> => {
  const API_URL = `${BASE_API_URL}${END_POINTS.RECIPE(id)}`;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    const res = await fetch(API_URL, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`[getrecipionServer] Failed to fetch recipe ${id}:`, error);
    return null;
  }
};

export const getStaticrecipionServer = async (
  id: string
): Promise<StaticRecipe | null> => {
  const API_URL = `${BASE_API_URL}${END_POINTS.RECIPE(id)}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPE_DETAIL,
        tags: [CACHE_TAGS.recipe(id)],
      },
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 401 || res.status === 403) {
        return null;
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(
      `[getStaticrecipionServer] Failed to fetch recipe ${id}:`,
      error
    );
    return null;
  }
};

export const getLocalizedRecipeOnServer = async (
  id: string,
  locale: "ja" | "en"
): Promise<LocalizedRecipeResult> => {
  const url = new URL(`${BASE_API_URL}${END_POINTS.RECIPE(id)}`);
  url.searchParams.set("lang", locale);

  try {
    const res = await fetch(url.toString(), {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPE_DETAIL,
        tags: [CACHE_TAGS.recipe(id)],
      },
    });
    const body = await res.json().catch(() => null);
    return parseLocalizedRecipeResult(res.status, body);
  } catch (error) {
    console.error(
      `[getLocalizedRecipeOnServer] Failed to fetch recipe ${id} (${locale}):`,
      error
    );
    return { kind: "notFound" };
  }
};

export const fetchRecentRecipesForFeed = async (
  size = 100
): Promise<StaticDetailedRecipeGridItem[]> => {
  const query = new URLSearchParams({
    page: "0",
    size: String(size),
    sort: "createdAt,desc",
  });
  const API_URL = `${BASE_API_URL}${END_POINTS.RECIPE_SEARCH}?${query.toString()}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_FEED,
        tags: [CACHE_TAGS.recipesFeed],
      },
    });
    if (!res.ok) {
      console.error(
        `[fetchRecentRecipesForFeed] API Error: ${res.status} ${res.statusText}`
      );
      return [];
    }
    const data = (await res.json()) as StaticDetailedRecipesApiResponse;
    return data.content;
  } catch (error) {
    console.error("[fetchRecentRecipesForFeed] Failed:", error);
    return [];
  }
};

const SITEMAP_FETCH_TIMEOUT_MS = 15000;

export const fetchRecipeSitemapPage = async (
  pageIndex: number,
  size: number
): Promise<Array<{ id: string; updatedAt: string }>> => {
  const query = new URLSearchParams({
    page: String(pageIndex),
    size: String(size),
  });
  const API_URL = `${BASE_API_URL}/recipes/sitemap?${query}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_SITEMAP,
        tags: [CACHE_TAGS.recipesSitemap],
      },
      signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(
        `[fetchRecipeSitemapPage] API Error: ${res.status} ${res.statusText}`
      );
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("[fetchRecipeSitemapPage] Failed to fetch recipes:", error);
    return [];
  }
};

export const fetchJaRecipeSitemapPage = async (
  pageIndex: number,
  size: number
): Promise<Array<{ id: string; updatedAt: string }>> => {
  const query = new URLSearchParams({
    page: String(pageIndex),
    size: String(size),
  });
  const API_URL = `${BASE_API_URL}/recipes/sitemap/ja?${query}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_SITEMAP,
        tags: [CACHE_TAGS.recipesSitemapJa],
      },
      signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(
        `[fetchJaRecipeSitemapPage] API Error: ${res.status} ${res.statusText}`
      );
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("[fetchJaRecipeSitemapPage] Failed to fetch recipes:", error);
    return [];
  }
};

export const fetchEnRecipeSitemapPage = async (
  pageIndex: number,
  size: number
): Promise<Array<{ id: string; updatedAt: string }>> => {
  const query = new URLSearchParams({
    page: String(pageIndex),
    size: String(size),
  });
  const API_URL = `${BASE_API_URL}/recipes/sitemap/en?${query}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_SITEMAP,
        tags: [CACHE_TAGS.recipesSitemapEn],
      },
      signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(
        `[fetchEnRecipeSitemapPage] API Error: ${res.status} ${res.statusText}`
      );
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("[fetchEnRecipeSitemapPage] Failed to fetch recipes:", error);
    return [];
  }
};

export const getStaticRecipesOnServer = async (
  params: RecipeItemsQueryParams
): Promise<StaticDetailedRecipesApiResponse> => {
  const query = new URLSearchParams({
    page: "0",
    size: "10",
    sort: resolveSortParam(params.sort, "createdAt,desc"),
  });

  if (params.q) query.append("q", params.q);
  if (params.isAiGenerated) query.append("isAiGenerated", "true");
  if (params.dishType) query.append("dishType", params.dishType);
  if (params.tags && params.tags.length > 0) {
    query.set("tags", params.tags.join(","));
  }
  if (params.maxCost) query.append("maxCost", params.maxCost.toString());
  if (params.period) query.append("period", params.period);
  if (params.lang) query.append("lang", params.lang);

  let endpoint: string = END_POINTS.RECIPE_SEARCH;
  let cacheTags: string[] = [];
  let revalidateTime = REVALIDATION_TIMES.RECIPES_POPULAR;

  if (params.key === "budget-recipes") {
    endpoint = END_POINTS.RECIPE_BUDGET;
    cacheTags = [CACHE_TAGS.recipesBudget];
    revalidateTime = REVALIDATION_TIMES.RECIPES_BUDGET;
  } else if (params.key === "popular-recipes") {
    endpoint = END_POINTS.RECIPE_POPULAR;
    cacheTags = [CACHE_TAGS.recipesPopular];
    revalidateTime = REVALIDATION_TIMES.RECIPES_POPULAR;
  } else if (params.key === "recommended-recipes" && params.recipeId) {
    endpoint = END_POINTS.RECIPE_RECOMMENDATIONS(params.recipeId);
    cacheTags = [CACHE_TAGS.recipesRecommended(params.recipeId)];
    revalidateTime = REVALIDATION_TIMES.RECIPES_RECOMMENDED;
  }

  const API_URL = `${BASE_API_URL}${endpoint}?${query.toString()}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: revalidateTime,
        tags: cacheTags,
      },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`[getStaticRecipesOnServer] Failed to fetch recipes:`, error);

    return {
      content: [],
      page: {
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }
};
export const getRecommendedRecipesOnServer = async (
  recipeId: string
): Promise<StaticDetailedRecipeGridItem[]> => {
  const endpoint = END_POINTS.RECIPE_RECOMMENDATIONS(recipeId);
  const cacheTags = [CACHE_TAGS.recipesRecommended(recipeId)];

  const API_URL = `${BASE_API_URL}${endpoint}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_RECOMMENDED,
        tags: cacheTags,
      },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as StaticDetailedRecipeGridItem[];
  } catch (error) {
    console.error(`[getStaticRecipesOnServer] Failed to fetch recipes:`, error);

    return [];
  }
};

export const getTrendingYoutubeRecipesOnServer = async (
  lang?: Locale
): Promise<TrendingYoutubeRecipe[]> => {
  const url = new URL(`${BASE_API_URL}${END_POINTS.RECIPE_YOUTUBE_RECOMMEND}`);
  if (lang && lang !== "ko") url.searchParams.set("lang", lang);

  try {
    const res = await fetch(url.toString(), {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_TRENDING,
        tags: [CACHE_TAGS.recipesTrending],
      },
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(
      "[getTrendingYoutubeRecipesOnServer] Failed to fetch trending recipes:",
      error
    );
    return [];
  }
};

const withLang = (base: string, locale: Locale) => {
  const url = new URL(`${BASE_API_URL}${base}`);
  if (locale !== "ko") url.searchParams.set("lang", locale);
  return url.toString();
};

export const getYoutubeVerifiedOnServer = (
  locale: Locale
): Promise<YoutubeVerifiedResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_YOUTUBE_VERIFIED, locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DISCOVERY,
    tags: [CACHE_TAGS.recipesDiscovery("youtube-verified")],
    fallback: { content: [] },
  });

export const getQuickPopularOnServer = (
  locale: Locale
): Promise<QuickPopularResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_QUICK_POPULAR, locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DISCOVERY,
    tags: [CACHE_TAGS.recipesDiscovery("quick-popular")],
    fallback: { maxCookingTime: 0, content: [] },
  });

export const getCountryPopularOnServer = (
  locale: Locale
): Promise<CountryPopularResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_COUNTRY_POPULAR, locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DISCOVERY,
    tags: [CACHE_TAGS.recipesDiscovery("country-popular")],
    fallback: { countryCode: "US", countryName: "", content: [] },
  });

export const getSeasonalPopularOnServer = (
  locale: Locale
): Promise<SeasonalPopularResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_SEASONAL_POPULAR, locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DISCOVERY,
    tags: [CACHE_TAGS.recipesDiscovery("seasonal-popular")],
    fallback: { seasonalIngredientName: null, content: [] },
  });

export const getCategoryPopularOnServer = (
  locale: Locale
): Promise<CategoryPopularResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_CATEGORY_POPULAR, locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DISCOVERY,
    tags: [CACHE_TAGS.recipesDiscovery("category-popular")],
    fallback: { categoryCode: "RICE", content: [] },
  });

export const getCookedPopularOnServer = (
  locale: Locale
): Promise<CookedPopularResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_COOKED_POPULAR, locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DISCOVERY,
    tags: [CACHE_TAGS.recipesDiscovery("cooked-popular")],
    fallback: { content: [] },
  });

export const getSameIngredientOnServer = (
  recipeId: string,
  locale: Locale
): Promise<SameIngredientResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_SAME_INGREDIENT(recipeId), locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DETAIL_SLIDES,
    tags: [CACHE_TAGS.recipesDetailSlide("same-ingredient", recipeId)],
    fallback: { ingredientName: null, content: [] },
  });

export const getTitleKeywordOnServer = (
  recipeId: string,
  locale: Locale
): Promise<TitleKeywordResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_TITLE_KEYWORD(recipeId), locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DETAIL_SLIDES,
    tags: [CACHE_TAGS.recipesDetailSlide("title-keyword", recipeId)],
    fallback: { keyword: null, content: [] },
  });

export const getRemixesOnServer = (
  recipeId: string,
  locale: Locale
): Promise<StaticDetailedRecipesApiResponse> =>
  safeFetchJson(withLang(END_POINTS.RECIPE_REMIXES(recipeId), locale), {
    revalidate: REVALIDATION_TIMES.RECIPES_DETAIL_SLIDES,
    tags: [CACHE_TAGS.recipesDetailSlide("remixes", recipeId)],
    fallback: {
      content: [],
      page: { size: 0, number: 0, totalElements: 0, totalPages: 0 },
    },
  });

export const getPrivateRecipeOnServer = async (
  id: string,
  locale?: Locale
): Promise<Recipe | null> => {
  const url = new URL(`${BASE_API_URL}/recipes/${id}`);
  if (locale && locale !== "ko") {
    url.searchParams.set("lang", locale);
  }

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    const res = await fetch(url.toString(), {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 401 || res.status === 403) {
        return null;
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(
      `[getPrivateRecipeOnServer] Failed to fetch private recipe ${id}:`,
      error
    );
    return null;
  }
};
