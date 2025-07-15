import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteIngredient = async (id: number) => {
  const response = await api.delete(END_POINTS.MY_INGREDIENTS_BY_ID(id));
  return response;
};

export const deleteIngredientBulk = async (ingredientIds: number[]) => {
  const response = await api.delete(END_POINTS.MY_INGREDIENTS_BULK, {
    body: JSON.stringify({
      ingredientIds,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
