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

export type IngredientNutrition = {
  calories: number;
  protein: number;
  carb: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
};

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
  // 백엔드 추가 대기 — 현재 응답엔 없을 수 있어 모두 optional
  shortDescription?: string | null;
  coupangLink?: string | null;
  nutritionPer100g?: IngredientNutrition | null;
  seasonMonths?: number[] | null;
  benefits?: string[] | null;
  prepTip?: string | null;
  substitutes?: string | null; // 슬래시 구분 — 페어링과 동일
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
  // 신규
  shortDescription: string | null;
  coupangLink: string | null;
  nutrition: IngredientNutrition | null;
  seasonMonths: number[]; // [] if null/undefined
  benefits: string[]; // [] if null/undefined
  prepTip: string | null;
  substitutes: string[]; // [] if null/undefined
};
