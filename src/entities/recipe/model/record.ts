import { Nutrition } from "./types";

export type RecipeRecordResponse = {
  message: string;
  recordId: number;
};

export type RecipeCompletionState = {
  recipeId: string;
  recordId: number;
  savedAmount: number;
  completedAt: string;
};

export type RecipeHistoryDetailResponse = {
  marketPrice: number;
  ingredientCost: number;
  nutrition: Nutrition;
  recipeId: string;
  recipeTitle: string;
  imageUrl: string;
  calories: number;
};
