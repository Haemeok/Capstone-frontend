export type CoupangProduct = {
  rank: number;
  name: string;
  price: number;
  imageUrl: string;
  url: string;
  categoryName: string;
  rocket: boolean;
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
