import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteIngredient = async (id: string): Promise<void> => {
  await api.delete<void>(END_POINTS.MY_INGREDIENTS_BY_ID(id));
};

export const deleteIngredientBulk = async (
  ingredientIds: string[]
): Promise<void> => {
  await api.delete<void>(END_POINTS.MY_INGREDIENTS_BULK, {
    body: JSON.stringify({
      ingredientIds,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
