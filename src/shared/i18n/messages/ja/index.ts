import type { Dictionary } from "../../types";
import { ingredientDetail } from "./ingredientDetail";
import { recipeDetail } from "./recipeDetail";
import { errors, meta, notFound, search } from "./search";
import { youtube } from "./youtube";

export const ja: Dictionary = {
  search,
  meta,
  errors,
  notFound,
  recipeDetail,
  youtube,
  ingredientDetail,
};
