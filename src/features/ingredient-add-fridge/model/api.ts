import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const addIngredient = async (ingredientId: number) => {
  const response = await api.post(END_POINTS.MY_INGREDIENTS, {
    ingredientId,
  });
  return response;
};

export const addIngredientBulk = async (ingredientIds: number[]) => {
  const response = await api.post(END_POINTS.MY_INGREDIENTS_BULK, {
    ingredientIds,
  });
  return response;
};
