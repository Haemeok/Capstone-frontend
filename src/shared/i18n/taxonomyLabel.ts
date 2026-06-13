import {
  DISH_TYPE_CODES,
  INGREDIENT_CATEGORY_CODES,
  SORT_TYPE_CODES,
  TAG_CODES,
} from "@/shared/config/constants/recipe";

import type { TaxonomyDict } from "./types";

export type TaxonomyDomain = keyof TaxonomyDict;

const KO_TO_CODE: Partial<Record<string, Record<string, unknown>>> = {
  sort: SORT_TYPE_CODES,
  dishType: DISH_TYPE_CODES,
  tags: TAG_CODES,
  ingredientCategory: INGREDIENT_CATEGORY_CODES,
};

export const taxonomyLabel = (
  code: string,
  domain: TaxonomyDomain,
  dict: TaxonomyDict
): string => {
  const table = dict[domain] as Record<string, string>; // as: TaxonomyDict values are string-maps but TS loses that after keyof indexing
  return table[code] ?? code;
};

export const localizeTaxonomy = (
  koValue: string,
  domain: TaxonomyDomain,
  dict: TaxonomyDict
): string => {
  const reverse = KO_TO_CODE[domain as string];
  const code = reverse ? String(reverse[koValue] ?? koValue) : koValue;
  const table = dict[domain] as Record<string, string>; // as: same reason as taxonomyLabel
  return table[code] ?? koValue;
};
