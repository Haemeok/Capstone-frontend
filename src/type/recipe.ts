import { User } from './user';

export type UserIngredient = Omit<IngredientItem, 'unit' | 'price'>;

export type IngredientPayload = Omit<
  IngredientItem,
  'category' | 'price' | 'id' | 'imageUrl'
>;

export type RecipeStep = {
  stepNumber: number;
  instruction: string;
  stepImageUrl: string;
  action?: string;
  ingredients?: IngredientItem[];
};

export type RecipeStepPayload = Omit<
  RecipeStep,
  'stepImageUrl' | 'action' | 'ingredients'
> & {
  ingredients: IngredientPayload[];
};

export type Recipe = {
  id: number;
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
  ingredients: IngredientItem[];
  steps: RecipeStep[];
  tagNames: string[];
  author: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
};

export type RecipePayload = Omit<
  Recipe,
  | 'id'
  | 'ingredients'
  | 'steps'
  | 'totalIngredientCost'
  | 'marketPrice'
  | 'youtubeUrl'
  | 'imageURL'
  | 'author'
  | 'likeCount'
  | 'likedByCurrentUser'
  | 'favoriteByCurrentUser'
> & {
  ingredients: IngredientPayload[];
  steps: RecipeStepPayload[];
  cookingTime: number;
  servings: number;
};

export type RecipeFormValues = {
  title: string;
  dishType: string;
  description: string;
  cookingTime: string | number;
  servings: string | number;
  youtubeUrl?: string;
  cookingTools?: string[];
  tagNames: string[];
  imageFile: FileList | null;
  ingredients: IngredientPayload[];
  steps: Array<{
    stepNumber: number;
    instruction: string;
    imageFile?: FileList | null;
    ingredients: IngredientPayload[];
  }>;
};

export type RecipeGridItem = {
  id: number;
  title: string;
  imageUrl: string;
  authorName: string;
  rating: number;
  cookingTime: number;
  commentCount: number;
  createdAt: string;
  likeCount: number;
  likedByCurrentUser: boolean;
};

export type IngredientItem = {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  quantity?: string;
  price: number;
  unit: string;
};

export type CategoryItem = {
  id: number;
  name: string;
  imageUrl: string;
  count: number;
};

export type DefaultOption = {
  code: null;
  displayName: string;
};

export type SpecificOption = {
  code: string;
  displayName: string;
};

export type FilterOption = DefaultOption | SpecificOption;
