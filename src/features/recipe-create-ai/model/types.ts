export type IngredientFocusRequest = {
  ingredientIds: number[];
  dishType: string;
  cookingTime: number;
  servings: number;
};

export type CostEffectiveRequest = {
  targetBudget: number;
  targetCategory: string;
};

export type NutritionBalanceRequest = {
  targetStyle: string;
  targetCalories: string;
  targetCarbs: string;
  targetProtein: string;
  targetFat: string;
};

export type FineDiningRequest = {
  ingredientIds: number[];
  diningTier: "WHITE" | "BLACK";
};

export type AIRecommendedRecipeRequest =
  | IngredientFocusRequest
  | CostEffectiveRequest
  | NutritionBalanceRequest
  | FineDiningRequest;

export type AIRecommendedRecipe = {
  recipeId: number;
};
