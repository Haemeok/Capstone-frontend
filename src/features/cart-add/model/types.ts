import type { GuestCartItem } from "@/entities/cart";

export type AddCartItemArgs = {
  recipeIngredientId: string;
  name: string;
  quantity?: string;
  unit: string;
  servingRatio: number;
  recipe: GuestCartItem["recipe"];
};

export type AddCartResult =
  | { status: "added"; addedCount: number }
  | { status: "duplicate" }
  | { status: "limitExceeded" }
  | { status: "failed" };
