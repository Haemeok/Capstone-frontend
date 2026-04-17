import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { SaveToggleResponse } from "@/entities/recipe-book";

export const postRecipeSave = async (
  id: string
): Promise<SaveToggleResponse> => {
  return api.post<SaveToggleResponse>(END_POINTS.RECIPE_SAVE(id));
};
