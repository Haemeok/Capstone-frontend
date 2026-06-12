import type { Dictionary } from "../../types";
import { recipeDetail } from "./recipeDetail";
import { errors, meta, notFound, search } from "./search";
import { youtube } from "./youtube";

export const ko: Dictionary = {
  search,
  meta,
  errors,
  notFound,
  recipeDetail,
  youtube,
};
