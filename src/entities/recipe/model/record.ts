import { Nutrition } from "./types";

export type RecipeRecordResponse = {
  message: string;
  recordId: number;
};

export type RecipeCompletionState = {
  recipeId: number;
  recordId: number;
  savedAmount: number;
  completedAt: string;
};

export type RecipeHistoryDetailResponse = {
  marketPrice: number;
  ingredientCost: number;
  nutrition: Nutrition;
  recipeId: number;
  recipeTitle: string;
  imageUrl: string;
  calories: number;
};
