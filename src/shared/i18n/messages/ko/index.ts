import type { Dictionary } from "../../types";
import { aiRecipe } from "./aiRecipe";
import { auth } from "./auth";
import { category } from "./category";
import { common } from "./common";
import { fridge } from "./fridge";
import { home } from "./home";
import { ingredientDetail } from "./ingredientDetail";
import { ingredientPicker } from "./ingredientPicker";
import { nav } from "./nav";
import { ratings } from "./ratings";
import { recipeCreate } from "./recipeCreate";
import { recipeDetail } from "./recipeDetail";
import { recipeForm } from "./recipeForm";
import { referral } from "./referral";
import { errors, meta, notFound, search } from "./search";
import { searchDiscovery } from "./searchDiscovery";
import { settings } from "./settings";
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
  recipeForm,
  taxonomy,
  category,
  ingredientPicker,
  common,
  referral,
  settings,
  ratings,
  auth,
};
