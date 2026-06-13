"use client";

import { usePathname } from "next/navigation";

import { ingredientPickerMessages } from "./ingredientPickerMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { IngredientPickerDict, Locale } from "./types";

export const useIngredientPickerLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useIngredientPickerDict = (): IngredientPickerDict =>
  ingredientPickerMessages[useIngredientPickerLocale()];
