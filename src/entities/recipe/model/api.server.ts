import { cookies } from "next/headers";

import { CACHE_TAGS, REVALIDATION_TIMES } from "@/shared/config/cache";
import { BASE_API_URL } from "@/shared/config/constants/api";

import {
  DetailedRecipesApiResponse,
  Recipe,
  RecipeItemsQueryParams,
  StaticDetailedRecipeGridItem,
  StaticDetailedRecipesApiResponse,
  StaticRecipe,
  TrendingYoutubeRecipe,
} from "./types";

const resolveSortParam = (sort: string | undefined, fallback: string): string => {
  if (!sort) return fallback;
  return sort.includes(",") ? sort : `createdAt,${sort}`;
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
  if (params.maxCost !== undefined) query.append("maxCost", params.maxCost.toString());
  if (params.minCost !== undefined) query.append("minCost", params.minCost.toString());
  if (params.period) query.append("period", params.period);

  if (params.minCalories !== undefined) query.append("minCalories", params.minCalories.toString());
  if (params.maxCalories !== undefined) query.append("maxCalories", params.maxCalories.toString());
  if (params.minCarb !== undefined) query.append("minCarb", params.minCarb.toString());
  if (params.maxCarb !== undefined) query.append("maxCarb", params.maxCarb.toString());
  if (params.minProtein !== undefined) query.append("minProtein", params.minProtein.toString());
  if (params.maxProtein !== undefined) query.append("maxProtein", params.maxProtein.toString());
  if (params.minFat !== undefined) query.append("minFat", params.minFat.toString());
  if (params.maxFat !== undefined) query.append("maxFat", params.maxFat.toString());
  if (params.minSugar !== undefined) query.append("minSugar", params.minSugar.toString());
  if (params.maxSugar !== undefined) query.append("maxSugar", params.maxSugar.toString());
  if (params.minSodium !== undefined) query.append("minSodium", params.minSodium.toString());
  if (params.maxSodium !== undefined) query.append("maxSodium", params.maxSodium.toString());

  let endpoint = "/recipes/search";

  if (params.key === "budget-recipes") {
    endpoint = "/recipes/budget";
  } else if (params.key === "popular-recipes") {
    endpoint = "/recipes/popular";
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
  const API_URL = `${BASE_API_URL}/recipes/${id}`;

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
  const API_URL = `${BASE_API_URL}/v2/recipes/${id}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPE_DETAIL,
        tags: [CACHE_TAGS.recipe(id)],
      },
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
      `[getStaticrecipionServer] Failed to fetch recipe ${id}:`,
      error
    );
    return null;
  }
};

export const fetchAllRecipesForSitemap = async (): Promise<
  Array<{ id: string; updatedAt: string }>
> => {
  const API_URL = `${BASE_API_URL}/recipes/sitemap`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_SITEMAP,
        tags: [CACHE_TAGS.recipesSitemap],
      },
    });

    if (!res.ok) {
      console.error(
        `[fetchAllRecipesForSitemap] API Error: ${res.status} ${res.statusText}`
      );
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(
      "[fetchAllRecipesForSitemap] Failed to fetch recipes:",
      error
    );
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

  let endpoint = "/v2/recipes/search";
  let cacheTags: string[] = [];
  let revalidateTime = REVALIDATION_TIMES.RECIPES_POPULAR;

  if (params.key === "budget-recipes") {
    endpoint = "/v2/recipes/budget";
    cacheTags = [CACHE_TAGS.recipesBudget];
    revalidateTime = REVALIDATION_TIMES.RECIPES_BUDGET;
  } else if (params.key === "popular-recipes") {
    endpoint = "/v2/recipes/popular";
    cacheTags = [CACHE_TAGS.recipesPopular];
    revalidateTime = REVALIDATION_TIMES.RECIPES_POPULAR;
  } else if (params.key === "recommended-recipes" && params.recipeId) {
    endpoint = `/recipes/${params.recipeId}/recommendations`;
    cacheTags = [CACHE_TAGS.recipesRecommended(params.recipeId)];
    revalidateTime = REVALIDATION_TIMES.RECIPES_RECOMMENDED;
  } else if (params.key === "latest-recipes") {
    // endpoint stays /v2/recipes/search; sort defaults to createdAt,desc via resolveSortParam
    cacheTags = [CACHE_TAGS.recipesLatest];
    revalidateTime = REVALIDATION_TIMES.RECIPES_LATEST;
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
  const endpoint = `/recipes/${recipeId}/recommendations`;
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

    return res.json();
  } catch (error) {
    console.error(`[getStaticRecipesOnServer] Failed to fetch recipes:`, error);

    return [];
  }
};

export const getTrendingYoutubeRecipesOnServer = async (): Promise<
  TrendingYoutubeRecipe[]
> => {
  const API_URL = `${BASE_API_URL}/recipes/youtube/recommend`;

  try {
    const res = await fetch(API_URL, {
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
