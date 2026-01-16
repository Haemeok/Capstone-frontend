"use server";

import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/shared/config/constants/cache-tags";

export const invalidateRecipeCache = async (recipeId: string) => {
  revalidateTag(CACHE_TAGS.recipe(recipeId));
  revalidateTag(CACHE_TAGS.recipesAll);
};
