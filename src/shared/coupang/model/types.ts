export type CoupangDeliveryType = "ROCKET_FRESH" | "ROCKET" | "STANDARD";

export type CoupangProduct = {
  rank: number;
  name: string;
  price: number;
  imageUrl: string;
  url: string;
  deliveryType: CoupangDeliveryType;
  freeShipping: boolean;
};

export type CoupangRecipeItem = {
  recipeIngredientId: string;
  coupangName: string;
  landingUrl: string;
  lastCollectedAt: string;
  products: CoupangProduct[];
};

export type RecipeCoupangProductsResponse = {
  recipeId: string;
  items: CoupangRecipeItem[];
};

export type IngredientCoupang = {
  landingUrl: string;
  lastCollectedAt: string;
  products: CoupangProduct[];
};
