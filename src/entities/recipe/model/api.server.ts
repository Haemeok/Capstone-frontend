import { cookies } from "next/headers";

import { BASE_API_URL } from "@/shared/config/constants/api";
import { CACHE_TAGS } from "@/shared/config/constants/cache-tags";

import {
  DetailedRecipesApiResponse,
  Recipe,
  RecipeItemsQueryParams,
  StaticDetailedRecipesApiResponse,
  StaticRecipe,
} from "./types";

export const getRecipesOnServer = async (
  params: RecipeItemsQueryParams
): Promise<DetailedRecipesApiResponse> => {
  const query = new URLSearchParams({
    page: "0",
    size: "10",
    sort: `createdAt,${params.sort || "desc"}`,
  });

  if (params.q) query.append("q", params.q);
  if (params.isAiGenerated) query.append("isAiGenerated", "true");
  if (params.dishType) query.append("dishType", params.dishType);
  if (params.tags) {
    params.tags.forEach((tag) => query.append("tags", tag));
  }
  if (params.maxCost) query.append("maxCost", params.maxCost.toString());
  if (params.period) query.append("period", params.period);

  let endpoint = "/recipes/search";
  if (params.maxCost) {
    endpoint = "/recipes/budget";
  } else if (params.period) {
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

export const getrecipionServer = async (id: number): Promise<Recipe | null> => {
  const API_URL = `${BASE_API_URL}/recipes/${id}`;
  if (isNaN(id) || id <= 0) {
    return null;
  }
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
  id: number
): Promise<StaticRecipe | null> => {
  const API_URL = `${BASE_API_URL}/v2/recipes/${id}`;
  if (isNaN(id) || id <= 0) {
    return null;
  }
  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: 3600,
        tags: [CACHE_TAGS.recipe(id), CACHE_TAGS.recipesAll],
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

const REVALIDATE_TIME_SECONDS = 3600;

export const fetchAllRecipesForSitemap = async (): Promise<
  Array<{ id: number; createdAt: string; imageUrl: string }>
> => {
  const SITEMAP_PAGE_SIZE = 100;
  const MAX_PAGES = 500;
  const allRecipes: Array<{ id: number; createdAt: string; imageUrl: string }> =
    [];

  try {
    let currentPage = 0;
    let hasMorePages = true;

    while (hasMorePages && currentPage < MAX_PAGES) {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        size: SITEMAP_PAGE_SIZE.toString(),
        sort: "createdAt,desc",
      });

      const API_URL = `${BASE_API_URL}/v2/recipes/search?${query.toString()}`;

      const res = await fetch(API_URL, {
        next: {
          revalidate: REVALIDATE_TIME_SECONDS,
          tags: [CACHE_TAGS.recipesAll],
        },
      });

      if (!res.ok) {
        console.error(
          `[fetchAllRecipesForSitemap] API Error: ${res.status} ${res.statusText}`
        );
        break;
      }

      const data: StaticDetailedRecipesApiResponse = await res.json();

      const pageRecipes = data.content.map((recipe) => ({
        id: recipe.id,
        createdAt: recipe.createdAt,
        imageUrl: recipe.imageUrl,
      }));

      allRecipes.push(...pageRecipes);

      hasMorePages = currentPage < data.page.totalPages - 1;
      currentPage++;
    }

    return allRecipes;
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
    sort: `createdAt,${params.sort || "desc"}`,
  });

  if (params.q) query.append("q", params.q);
  if (params.isAiGenerated) query.append("isAiGenerated", "true");
  if (params.dishType) query.append("dishType", params.dishType);
  if (params.tags) {
    params.tags.forEach((tag) => query.append("tags", tag));
  }
  if (params.maxCost) query.append("maxCost", params.maxCost.toString());
  if (params.period) query.append("period", params.period);

  let endpoint = "/v2/recipes/search";
  let cacheTags: string[] = [CACHE_TAGS.recipesAll];

  if (params.maxCost) {
    endpoint = "/v2/recipes/budget";
    cacheTags.push(CACHE_TAGS.recipesBudget);
  } else if (params.period) {
    endpoint = "/v2/recipes/popular";
    cacheTags.push(CACHE_TAGS.recipesPopular);
  }

  const API_URL = `${BASE_API_URL}${endpoint}?${query.toString()}`;

  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: REVALIDATE_TIME_SECONDS,
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
