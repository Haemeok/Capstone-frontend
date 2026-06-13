"use client";

import { usePathname } from "next/navigation";

import { recipeFormMessages } from "./recipeFormMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { Locale, RecipeFormDict } from "./types";

export const useRecipeFormLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useRecipeFormDict = (): RecipeFormDict =>
  recipeFormMessages[useRecipeFormLocale()];
