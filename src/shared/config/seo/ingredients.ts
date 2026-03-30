import ingredientsData from "./ingredients.json";

export type SeoIngredient = {
  id: string;
  name: string;
  isMainIngredient: boolean;
  tier?: 1 | 2 | 3;
};

export const ALL_INGREDIENTS: SeoIngredient[] = ingredientsData as SeoIngredient[];
export const MAIN_INGREDIENTS: SeoIngredient[] = ALL_INGREDIENTS.filter(
  (i) => i.isMainIngredient
);
