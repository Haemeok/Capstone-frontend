import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const addIngredient = async (ingredientId: string): Promise<void> => {
  await api.post<void>(END_POINTS.MY_INGREDIENTS, {
    ingredientId,
  });
};

export const addIngredientBulk = async (
  ingredientIds: string[]
): Promise<void> => {
  await api.post<void>(END_POINTS.MY_INGREDIENTS_BULK, {
    ingredientIds,
  });
};
