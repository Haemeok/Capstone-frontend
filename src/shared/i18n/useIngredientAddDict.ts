"use client";

import { usePathname } from "next/navigation";

import { ingredientAddMessages } from "./ingredientAddMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { IngredientAddDict } from "./types";

export const useIngredientAddDict = (): IngredientAddDict =>
  ingredientAddMessages[resolveChromeLocale(usePathname() ?? "/")];
