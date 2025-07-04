export type AIRecommendedRecipeRequest = {
  ingredients: string[];
  dishType: string;
  cookingTime: string;
  servings: number;
};

export type AIRecommendedRecipe = {
  recipeId: number;
};
