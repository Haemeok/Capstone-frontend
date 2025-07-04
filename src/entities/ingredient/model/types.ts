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
};

export type UserIngredient = Omit<IngredientItem, "unit" | "price">;

export type IngredientPayload = Omit<
  IngredientItem,
  "category" | "price" | "id" | "imageUrl" | "inFridge"
>;

export type IngredientWithAI = Omit<IngredientItem, "inFridge">;

export type IngredientsApiResponse = PageResponse<IngredientItem>;

export type IngredientQueryParams = BaseQueryParams & {
  category?: string | null;
};
