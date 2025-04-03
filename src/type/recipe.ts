export type Ingredient = {
  quantity: string;
  name: string;
  unit: string;
};

export type RecipeStep = {
  ingredients: Ingredient[];
  instruction: string;
  utensils: string[];
  action: string;
  stepImageUrl: string;
  stepNumber: number;
  cookingTools: string;
};

export type Recipe = {
  id?: number;
  title: string;
  imageURL: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  dishType: string;
  cookingTime: number;
  cookingTools: string;
  isAigenerated: boolean;
  youtubeUrl?: string;
  servings: number;
  totalIngredientCost?: number;
  marketPrice?: number;
  tagNames?: string[];
};

export type RecipeGridItem = {
  id: number;
  title: string;
  imageUrl: string;
};

export type IngredientItem = {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
};
