import type { IngredientFocusRequest } from "./types";

export const buildIngredientFocusRequest = (data: {
  ingredientIds: string[];
  dishType: string;
  cookingTime: number;
  servings: number;
}): IngredientFocusRequest => {
  return {
    ingredientIds: data.ingredientIds,
    dishType: data.dishType,
    cookingTime: data.cookingTime,
    servings: data.servings,
  };
};
