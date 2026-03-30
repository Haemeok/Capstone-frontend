import * as fs from "fs";
import { INGREDIENTS_JSON_PATH } from "./seo-constants";

export type IngredientEntry = {
  id: string;
  name: string;
  isMainIngredient: boolean;
  tier?: 1 | 2 | 3;
};

let _cached: IngredientEntry[] | null = null;

export const loadIngredients = (): IngredientEntry[] => {
  if (_cached) return _cached;
  _cached = JSON.parse(fs.readFileSync(INGREDIENTS_JSON_PATH, "utf-8"));
  return _cached!;
};

export const loadMainIngredients = (): IngredientEntry[] =>
  loadIngredients().filter((i) => i.isMainIngredient);

export const loadIngredientMap = (): Map<string, string> => {
  const map = new Map<string, string>();
  for (const ing of loadIngredients()) {
    if (ing.isMainIngredient) map.set(ing.id, ing.name);
  }
  return map;
};
