import type { Dictionary } from "../../types";
import { aiRecipe } from "./aiRecipe";
import { fridge } from "./fridge";
import { home } from "./home";
import { ingredientDetail } from "./ingredientDetail";
import { nav } from "./nav";
import { recipeCreate } from "./recipeCreate";
import { recipeDetail } from "./recipeDetail";
import { errors, meta, notFound, search } from "./search";
import { searchDiscovery } from "./searchDiscovery";
import { taxonomy } from "./taxonomy";
import { userPages } from "./userPages";
import { youtube } from "./youtube";

export const ko: Dictionary = {
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
  fridge,
  searchDiscovery,
  userPages,
  recipeCreate,
  taxonomy,
};
