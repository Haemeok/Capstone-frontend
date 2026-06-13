import type { Dictionary } from "../../types";
import { aiRecipe } from "./aiRecipe";
import { home } from "./home";
import { ingredientDetail } from "./ingredientDetail";
import { nav } from "./nav";
import { recipeDetail } from "./recipeDetail";
import { errors, meta, notFound, search } from "./search";
import { searchDiscovery } from "./searchDiscovery";
import { youtube } from "./youtube";

export const en: Dictionary = {
  search,
  meta,
  errors,
  notFound,
  recipeDetail,
  youtube,
  ingredientDetail,
  aiRecipe,
  nav,
  home,
  searchDiscovery,
};
