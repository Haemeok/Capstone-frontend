import { InfiniteData } from "@tanstack/react-query";

import type { DetailedRecipeGridItem } from "@/entities/recipe";
import { BaseQueryParams, PageResponse } from "@/shared/api/types";

export type IngredientItem = {
  id: string;
  name: string;
  imageUrl?: string;
  category?: string;
  quantity?: string;
  price?: number;
  unit: string;
  inFridge: boolean;
  calories: number;
  coupangLink?: string;
};

export type UserIngredient = Omit<IngredientItem, "unit" | "price">;

export type IngredientPayload = {
  id?: string;
  name: string;
  quantity: string;
  unit: string;
};

export type AIIngredientPayload = {
  id: string;
  name: string;
};

export type IngredientWithAI = Omit<IngredientItem, "inFridge">;

export type IngredientsApiResponse = PageResponse<IngredientItem>;

export type IngredientQueryParams = BaseQueryParams & {
  category?: string | null;
};

export type IngredientMutationContext = {
  previousIngredientsListData?: InfiniteData<IngredientsApiResponse>;
};

export type IngredientNameItem = { id: string; name: string };
export type IngredientNamesResponse = { content: IngredientNameItem[] };

export type IngredientDetailApiResponse = {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  storageLocation: string | null;
  storageTemperature: string | null;
  storageDuration: string | null;
  storageNotes: string | null;
  goodPairs: string | null;
  badPairs: string | null;
  recommendedCookingMethods: string | null;
  recipes: DetailedRecipeGridItem[];
};

export type IngredientStorageView = {
  location: string | null;
  temperature: string | null;
  duration: string | null;
  notes: string | null;
};

export type IngredientDetailView = {
  id: string;
  name: string;
  imageUrl: string | null;
  categoryLabel: string | null;
  storage: IngredientStorageView;
  pairings: {
    good: string[];
    bad: string[];
  };
  cookingMethods: string[];
};
