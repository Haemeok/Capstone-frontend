import { User } from './user';
import { Comment } from './comment';

export type UserIngredient = Omit<IngredientItem, 'unit' | 'price'>;

export type IngredientPayload = Omit<
  IngredientItem,
  'category' | 'price' | 'id' | 'imageUrl' | 'inFridge'
>;

export type RecipeStep = {
  stepNumber: number;
  instruction: string;
  stepImageUrl: string;
  action?: string;
  ingredients?: IngredientItem[];
  stepImageKey: string | null | undefined;
};

export type RecipeStepPayload = Omit<
  RecipeStep,
  'stepImageUrl' | 'action' | 'ingredients' | 'imageKey'
> & {
  ingredients: IngredientPayload[];
  imageKey?: string;
};

type RatingInfo = {
  avgRating: number;
  myRating: number;
  ratingCount: number;
};

export type Recipe = {
  id: number;
  title: string;
  dishType: string;
  description: string;
  cookingTime: number | undefined | '';
  imageUrl: string;
  youtubeUrl?: string;
  cookingTools: string[];
  servings: number | undefined | '';
  totalIngredientCost: number;
  marketPrice: number;
  imageKey: string | null | undefined;
  ratingInfo: RatingInfo;
  ingredients: Omit<IngredientItem, 'inFridge'>[];
  steps: RecipeStep[];
  tagNames: string[];
  comments: Comment[];
  author: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  private: boolean;
  aiGenerated: boolean;
};

const defaultRecipeKeys = [
  'id',
  'ingredients',
  'steps',
  'totalIngredientCost',
  'marketPrice',
  'youtubeUrl',
  'imageURL',
  'author',
  'likeCount',
  'likedByCurrentUser',
  'favoriteByCurrentUser',
  'ratingInfo',
  'comments',
  'imageUrl',
  'imageKey',
  'private',
  'aiGenerated',
] as const;

export type RecipePayload = Omit<Recipe, (typeof defaultRecipeKeys)[number]> & {
  ingredients: IngredientPayload[];
  steps: RecipeStepPayload[];
  cookingTime: number;
  servings: number;
  imageKey?: string | null;
};

export type AIRecommendedRecipe = {
  recipeId: number;
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
  imageKey?: string | null;
  ingredients: IngredientPayload[];
  steps: Array<{
    stepNumber: number;
    instruction: string;
    imageFile?: FileList | null;
    imageKey?: string | null;
    ingredients: IngredientPayload[];
  }>;
};

export type DetailedRecipeGridItem = BaseRecipeGridItem & {
  avgRating: number;
  ratingCount: number;
};

export type BaseRecipeGridItem = {
  id: number;
  title: string;
  imageUrl: string;
  authorName: string;
  authorId: number;
  profileImage: string;
  cookingTime?: number;
  createdAt: string;
  likeCount: number;
  likedByCurrentUser: boolean;
};

export type UserRecipeGridItem = Omit<
  BaseRecipeGridItem,
  'authorName' | 'profileImage' | 'likeCount' | 'authorId'
>;

export type IngredientItem = {
  id: number;
  name: string;
  imageUrl?: string;
  category?: string;
  quantity?: string;
  price?: number;
  unit: string;
  inFridge: boolean;
};

export type IngredientWithAI = Omit<IngredientItem, 'inFridge'>;

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

export type RecipeHistoryItem = {
  recipeId: number;
  recipeTitle: string;
  savings: number;
  imageUrl: string;
};

export type RecipeDailySummary = {
  date: string;
  totalSavings: number;
  totalCount: number;
  firstImageUrl: string;
};
