import type { CoupangProduct } from "@/shared/coupang";

export type CartRecipeRef = {
  recipeId: string;
  title: string;
  deleted: boolean;
};

export type CartItem = {
  cartItemId: string;
  name: string;
  quantity: string;
  unit: string;
  recipe: CartRecipeRef;
};

export type CartRecipeTab = {
  recipeId: string;
  title: string;
  imageUrl: string | null;
  itemCount: number;
  deleted: boolean;
};

export type CartCoupangInfo = {
  coupangName: string;
  landingUrl: string;
  lastCollectedAt: string;
  products: CoupangProduct[];
};

export type CartGroup = {
  coupangInfo: CartCoupangInfo;
  items: CartItem[];
};

export type CartResponse = {
  totalItemCount: number;
  recipes: CartRecipeTab[];
  groups: CartGroup[];
  unmatchedItems: CartItem[];
};

export type AddCartItemInput = {
  recipeIngredientId: string;
  quantity?: string;
  unit?: string;
};

export type AddCartItemsRequest = { items: AddCartItemInput[] };

export type AddCartItemsResponse = {
  addedCount: number;
  skippedCount: number;
  cartItemIds: string[];
};

export type UpdateCartItemRequest = { quantity?: string; unit?: string };

export const CART_ERROR_CODES = {
  ITEM_NOT_FOUND: "1401",
  SOURCE_INGREDIENT_NOT_FOUND: "1402",
  LIMIT_EXCEEDED: "1403",
} as const;

export const CART_MAX_ITEMS = 200;
