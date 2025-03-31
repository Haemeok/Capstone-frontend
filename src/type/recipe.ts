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
};

export type RecipeGridItem = {
  id: number;
  title: string;
  imageUrl: string;
};
