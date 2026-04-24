import { InfiniteData } from "@tanstack/react-query";

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

export type StorageInfo = {
  temperatureLabel: string;
  durationLabel: string;
  tip: string;
};

export type PairingIngredient = {
  id: string;
  name: string;
  imageUrl?: string;
};

export type CookingMethod = {
  id: string;
  name: string;
  icon: string;
};

export type IngredientDetail = {
  id: string;
  name: string;
  imageUrl?: string;
  categoryLabel: string;
  storage: StorageInfo;
  pairings: {
    good: PairingIngredient[];
    bad: PairingIngredient[];
  };
  cookingMethods: CookingMethod[];
};
