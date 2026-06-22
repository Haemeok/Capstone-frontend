"use client";

import { usePathname } from "next/navigation";

import { recipeActionsMessages } from "./recipeActionsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { RecipeActionsDict } from "./types";

export const useRecipeActionsDict = (): RecipeActionsDict =>
  recipeActionsMessages[resolveChromeLocale(usePathname() ?? "/")];
