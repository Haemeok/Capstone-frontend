export type Ingredient = {
  quantity: string;
  name: string;
};

export type RecipeStep = {
  ingredients: Ingredient[];
  instruction: string;
  utensils: string[];
};

export type Recipe = {
  id: number;
  title: string;
  imageURL: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
};
