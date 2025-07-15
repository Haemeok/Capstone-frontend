import { BaseQueryParams, PageResponse } from "@/shared/api/types";

import { Comment } from "@/entities/comment";
import { IngredientItem, IngredientPayload } from "@/entities/ingredient";
import { User } from "@/entities/user";

export type BaseRecipesApiResponse = PageResponse<BaseRecipeGridItem>;
export type DetailedRecipesApiResponse = PageResponse<DetailedRecipeGridItem>;

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

export type Recipe = {
  id: number;
  title: string;
  dishType: string;
  description: string;
  cookingTime: number | undefined | "";
  imageUrl: string;
  youtubeUrl?: string;
  cookingTools: string[];
  servings: number | undefined | "";
  totalIngredientCost: number;
  marketPrice: number;
  imageKey: string | null | undefined;
  ratingInfo: RatingInfo;
  ingredients: Omit<IngredientItem, "inFridge">[];
  steps: RecipeStep[];
  tagNames: string[];
  comments: Comment[];
  author: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  private: boolean;
  aiGenerated: boolean;
  totalCalories: number;
};

type RatingInfo = {
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

export type RecipeQueryParams = BaseQueryParams & {
  dishType?: string | null;
  tagNames?: string[] | null;
  q?: string | null;
  isAiGenerated?: boolean;
};

export type RecipeItemsQueryParams = {
  key: string; // Unique identifier for the query
  sort?: "desc" | "asc";
  isAiGenerated?: boolean;
  tagNames?: string[];
  q?: string;
  dishType?: string | null;
};
