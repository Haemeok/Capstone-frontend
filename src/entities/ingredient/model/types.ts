import { InfiniteData } from "@tanstack/react-query";

import { BaseQueryParams, PageResponse } from "@/shared/api/types";

export type IngredientItem = {
  id: number;
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

export type IngredientPayload = Omit<
  IngredientItem,
  "category" | "price" | "id" | "imageUrl" | "inFridge" | "calories"
>;

export type IngredientWithAI = Omit<IngredientItem, "inFridge">;

export type IngredientsApiResponse = PageResponse<IngredientItem>;

export type IngredientQueryParams = BaseQueryParams & {
  category?: string | null;
};

export type IngredientMutationContext = {
  previousIngredientsListData?: InfiniteData<IngredientsApiResponse>;
};
