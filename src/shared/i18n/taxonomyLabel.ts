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
  let code = reverse ? reverse[koValue] : koValue; // as: TaxonomyDomain is assignable to string key but TS rejects the index
  if (code === null || code === "" || code === undefined) {
    code = koValue === "전체" ? "ALL" : koValue;
  }
  const table = dict[domain] as Record<string, string>; // as: keyof indexing widens to union
  return table[String(code)] ?? koValue;
};
