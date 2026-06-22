import type { Dictionary } from "../../types";
import { aiRecipe } from "./aiRecipe";
import { auth } from "./auth";
import { category } from "./category";
import { comments } from "./comments";
import { common } from "./common";
import { events } from "./events";
import { fridge } from "./fridge";
import { home } from "./home";
import { ingredientAdd } from "./ingredientAdd";
import { ingredientDetail } from "./ingredientDetail";
import { ingredientPicker } from "./ingredientPicker";
import { ingredients } from "./ingredients";
import { ingredientSheet } from "./ingredientSheet";
import { landing } from "./landing";
import { nav } from "./nav";
import { notifications } from "./notifications";
import { ratings } from "./ratings";
import { recipeCreate } from "./recipeCreate";
import { recipeDetail } from "./recipeDetail";
import { recipeForm } from "./recipeForm";
import { recipeGrid } from "./recipeGrid";
import { referral } from "./referral";
import { errors, meta, notFound, search } from "./search";
import { searchDiscovery } from "./searchDiscovery";
import { settings } from "./settings";
import { taxonomy } from "./taxonomy";
import { uiCommon } from "./uiCommon";
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
  ingredientAdd,
  ingredients,
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
  recipeGrid,
  uiCommon,
  ingredientSheet,
  auth,
  notifications,
  comments,
  landing,
  events,
};
