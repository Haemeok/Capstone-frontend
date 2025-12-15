import { PageResponse } from "@/shared/api/types";

import { Comment } from "@/entities/comment";
import { IngredientItem, IngredientPayload } from "@/entities/ingredient";
import { User } from "@/entities/user";

export type BaseRecipesApiResponse = PageResponse<BaseRecipeGridItem>;
export type DetailedRecipesApiResponse = PageResponse<DetailedRecipeGridItem>;
export type StaticDetailedRecipesApiResponse =
  PageResponse<StaticDetailedRecipeGridItem>;
export type IngredientRecipesApiResponse =
  PageResponse<IngredientRecipeGridItem>;

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

export type DetailedRecipeGridItem = BaseRecipeGridItem & {
  avgRating: number;
  ratingCount: number;
  marketPrice?: number;
  ingredientCost?: number;
};

export type StaticDetailedRecipeGridItem = Omit<
  DetailedRecipeGridItem,
  "likedByCurrentUser"
>;

export type IngredientRecipeGridItem = DetailedRecipeGridItem & {
  matchedIngredients: string[];
};

export type Recipe = {
  id: number;
  title: string;
  dishType: string;
  description: string;
  cookingTime: number;
  imageUrl: string;
  youtubeUrl?: string;
  cookingTools: string[];
  servings: number;
  totalIngredientCost: number;
  marketPrice: number;
  imageKey: string | null | undefined;
  ratingInfo: RatingInfo;
  ingredients: Omit<IngredientItem, "inFridge">[];
  steps: RecipeStep[];
  tags: string[];
  comments: Comment[];
  author: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  private: boolean;
  aiGenerated: boolean;
  totalCalories: number;
  createdAt?: string;
  nutrition: Nutrition;
  cookingTips?: string;
};

export type Nutrition = {
  protein: number;
  carbohydrate: number;
  fat: number;
  sugar: number;
  sodium: number;
};

export type RatingInfo = {
  avgRating: number;
  myRating: number;
  ratingCount: number;
};

export type RecipeStep = {
  stepNumber: number;
  instruction: string;
  stepImageUrl: string;
  action?: string;
  ingredients?: IngredientItem[];
  stepImageKey: string | null | undefined;
};

const defaultRecipeKeys = [
  "id",
  "ingredients",
  "steps",
  "totalIngredientCost",
  "marketPrice",
  "youtubeUrl",
  "imageURL",
  "author",
  "likeCount",
  "likedByCurrentUser",
  "favoriteByCurrentUser",
  "ratingInfo",
  "comments",
  "imageUrl",
  "imageKey",
  "private",
  "aiGenerated",
  "totalCalories",
  "nutrition",
] as const;

export type RecipePayload = Omit<Recipe, (typeof defaultRecipeKeys)[number]> & {
  ingredients: IngredientPayload[];
  steps: RecipeStepPayload[];
  cookingTime: number;
  servings: number;
  imageKey?: string | null;
};

export type RecipeStepPayload = Omit<
  RecipeStep,
  "stepImageUrl" | "action" | "ingredients" | "imageKey"
> & {
  ingredients: IngredientPayload[];
  imageKey?: string;
};

export type RecipeQueryParams = {
  page?: number;
  size?: number;
  sort: string;
  q?: string;
  dishType?: string | null;
  tags?: string[] | null;
  isAiGenerated?: boolean;
  maxCost?: number;
  period?: "weekly" | "monthly";
  pageParam?: number;
};

export type RecipeItemsQueryParams = {
  key: string;
  sort?: "desc" | "asc";
  isAiGenerated?: boolean;
  tags?: string[];
  q?: string;
  dishType?: string | null;
  maxCost?: number;
  period?: "weekly" | "monthly";
};

export type StaticRecipe = Omit<
  Recipe,
  "likeCount" | "likedByCurrentUser" | "favoriteByCurrentUser" | "comments"
> & {
  comments: Omit<Comment, "likedByCurrentUser" | "likeCount">[];
};

export type RecipeStatus = {
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  myRating: number | null;
  comments: Array<{
    id: number;
    likedByCurrentUser: boolean;
    likeCount: number;
  }>;
};

export type RecipeListItemStatus = {
  likedByCurrentUser: boolean;
};

export type RecipesStatusResponse = Record<string, RecipeListItemStatus>;
