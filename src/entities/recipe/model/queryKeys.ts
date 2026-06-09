export const RECIPE_QUERY_KEYS = {
  myFridgeAll: ["my-fridge-recipes-v2"] as const,
  myFridge: (sort?: string) => ["my-fridge-recipes-v2", sort] as const,
  myIngredientAll: ["my-fridge-recipes"] as const,
  myIngredient: (sort?: string) => ["my-fridge-recipes", sort] as const,
};
