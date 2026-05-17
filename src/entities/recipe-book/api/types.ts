export type RecipeBook = {
  id: string;
  name: string;
  isDefault: boolean;
  displayOrder: number;
  recipeCount: number;
};

import { RecipeSource, Visibility } from "@/entities/recipe/model/types";

export type BookRecipe = {
  recipeId: string;
  title: string;
  imageUrl: string;
  dishType: string;
  addedAt: string;
  visibility?: Visibility | null;
  source?: RecipeSource | null;
  isRemix?: boolean;
  youtubeUrl?: string | null;
  youtubeChannelName?: string | null;
  youtubeVideoTitle?: string | null;
  youtubeThumbnailUrl?: string | null;
};

export type RecipeBookDetail = {
  id: string;
  name: string;
  isDefault: boolean;
  recipeCount: number;
  recipes: BookRecipe[];
  hasNext: boolean;
};

export type RecipeBookDetailParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export type CreateRecipeBookRequest = {
  name: string;
};

export type UpdateRecipeBookNameRequest = {
  name: string;
};

export type AddRecipesToBookRequest = {
  recipeIds: string[];
};

export type AddRecipesToBookResponse = {
  addedCount: number;
  skippedCount: number;
};

export type RemoveRecipesFromBookRequest = {
  recipeIds: string[];
};

export type SavedBookSummary = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type SavedBooksResponse = {
  saved: boolean;
  savedBookCount: number;
  books: SavedBookSummary[];
};

export type SaveToggleResponse = {
  saved: boolean;
  message: string;
};
