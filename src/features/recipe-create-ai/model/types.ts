export type AIRecommendedRecipeRequest = {
  ingredients: string[];
  dishType: string;
  cookingTime: number;
  servings: number;
  robotType: string;
};

export type AIRecommendedRecipe = {
  recipeId: number;
};
