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
