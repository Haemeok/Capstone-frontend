"use client";

import { usePathname } from "next/navigation";

import { recipeCreateMessages } from "./recipeCreateMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { Locale, RecipeCreateDict } from "./types";

export const useRecipeCreateLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useRecipeCreateDict = (): RecipeCreateDict =>
  recipeCreateMessages[useRecipeCreateLocale()];
