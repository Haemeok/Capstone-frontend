export type Ingredient = {
  id: number;
  quantity: string;
  name: string;
  unit: string;
};

export type RecipeStep = {
  id: number;
  ingredients?: Ingredient[];
  instruction: string;
  action?: string;
  stepImageUrl: string;
  stepNumber: number;
};

export type Recipe = {
  id?: number;
  title: string;
  description: string;
  imageURL: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  dishType: string;
  cookingTime: number | undefined | "";
  cookingTools: string;
  isAigenerated: boolean;
  youtubeUrl?: string;
  servings: number | undefined | "";
  totalIngredientCost?: number;
  marketPrice?: number;
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
