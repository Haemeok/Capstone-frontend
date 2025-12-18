export type IngredientFocusRequest = {
  ingredients: string[];
  dishType: string;
  cookingTime: number;
  servings: number;
};

export type CostEffectiveRequest = {
  targetBudget: number;
  targetCategory: string; // '면요리' | '밥요리' ...
};

export type NutritionBalanceRequest = {
  targetStyle: string; // 'Asian_Style' | 'Western_Style' | 'Light_Fresh'
  targetCalories: string; // '1000kcal' or '제한 없음'
  targetCarbs: string; // '30g' or '제한 없음'
  targetProtein: string;
  targetFat: string;
};

// 유니온 타입
export type AIRecommendedRecipeRequest =
  | IngredientFocusRequest
  | CostEffectiveRequest
  | NutritionBalanceRequest;

export type AIRecommendedRecipe = {
  recipeId: number;
};
