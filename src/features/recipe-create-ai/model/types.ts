export type AIRecommendedRecipeRequest = {
  ingredients: string[];
  dishType: string;
  cookingTime: string;
  servings: number;
  robotType: string;
};

export type AIRecommendedRecipe = {
  recipeId: number;
};
