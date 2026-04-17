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

export type RecordTimelineItem = {
  recordId: string;
  recipeId: string;
  recipeTitle: string;
  ingredientCost: number;
  marketPrice: number;
  nutrition: Nutrition;
  calories: number;
  imageUrl: string;
};

export type RecordTimelineGroup = {
  date: string;
  records: RecordTimelineItem[];
};

export type RecordTimelineResponse = {
  groups: RecordTimelineGroup[];
  hasNext: boolean;
};
