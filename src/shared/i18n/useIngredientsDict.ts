"use client";

import { usePathname } from "next/navigation";

import { ingredientsMessages } from "./ingredientsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { IngredientsDict } from "./types";

export const useIngredientsDict = (): IngredientsDict =>
  ingredientsMessages[resolveChromeLocale(usePathname() ?? "/")];
