"use client";

import { usePathname } from "next/navigation";

import { recipeGridMessages } from "./recipeGridMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { RecipeGridDict } from "./types";

export const useRecipeGridDict = (): RecipeGridDict =>
  recipeGridMessages[resolveChromeLocale(usePathname() ?? "/")];
