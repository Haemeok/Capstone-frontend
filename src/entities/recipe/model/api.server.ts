import { BASE_API_URL } from "@/shared/config/constants/api";
import { cookies } from "next/headers";

import {
  DetailedRecipesApiResponse,
  Recipe,
  RecipeItemsQueryParams,
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
  if (params.tagNames) {
    params.tagNames.forEach((tag) => query.append("tagNames", tag));
  }

  const API_URL = `${BASE_API_URL}/recipes/search?${query.toString()}`;

  try {
    const res = await fetch(API_URL, {
      headers: {
        Cookie: cookies().toString(),
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

export const getRecipeOnServer = async (id: number): Promise<Recipe | null> => {
  const API_URL = `${BASE_API_URL}/recipes/${id}`;
  if (isNaN(id) || id <= 0) {
    return null;
  }
  try {
    const res = await fetch(API_URL, {
      headers: {
        Cookie: cookies().toString(),
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
    console.error(`[getRecipeOnServer] Failed to fetch recipe ${id}:`, error);
    return null;
  }
};
