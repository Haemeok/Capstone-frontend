export type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

export type RecipeStep = {
  stepNumber: number;
  instruction: string;
  stepImageUrl: string;
  action?: string;
  ingredients?: Ingredient[];
};

export type Recipe = {
  id?: number;
  title: string;
  dishType: string;
  description: string;
  cookingTime: number | undefined | '';
  imageURL: string;
  youtubeUrl?: string;
  cookingTools: string[];
  servings: number | undefined | '';
  totalIngredientCost?: number;
  marketPrice?: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tagNames: string[];
};

export type RecipeGridItem = {
  id: number;
  title: string;
  imageUrl: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
  likedByCurrentUser: boolean;
};

export type IngredientItem = {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
};

export type CategoryItem = {
  id: number;
  name: string;
  imageUrl: string;
  count: number;
};
