import { convertNutritionToQueryParams } from "@/shared/lib/nutrition/parseNutritionParams";

import type { CreatorCountryTag } from "@/entities/recipe";

import { useCountryCodes } from "@/features/filter-country";
import { useDishTypeCode } from "@/features/filter-dish-type";
import { useIngredientsFilter } from "@/features/filter-ingredients";
import { useSortCode } from "@/features/filter-sort";
import { useTagCodes } from "@/features/filter-tags";
import { useNutritionParams } from "@/features/recipe-search";
import { useSearchQuery } from "@/features/search-input";

export type SearchFilterSnapshot = {
  dishTypeCode: string | null;
  sortCode: string | null;
  tagCodes: string[];
  ingredientIds: string[];
  creatorCountryTags: CreatorCountryTag[];
  q: string;
  nutritionQueryParams: Record<string, number>;
  types: string[];
  queryKey: readonly [
    "recipes",
    string | null,
    string | null,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  queryKeyString: string;
};

export const useSearchFilterSnapshot = (): SearchFilterSnapshot => {
  const dishTypeCode = useDishTypeCode();
  const sortCode = useSortCode();
  const tagCodes = useTagCodes();
  const [ingredientIds] = useIngredientsFilter();
  const creatorCountryTags = useCountryCodes();
  const { nutritionParams, types } = useNutritionParams();
  const { q } = useSearchQuery();

  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const nutritionKeyString = JSON.stringify(nutritionQueryParams);
  const tagsString = tagCodes.join(",");
  const typesString = types.join(",");
  const ingredientsString = ingredientIds.join(",");
  const countryString = creatorCountryTags.join(",");

  const queryKey = [
    "recipes",
    dishTypeCode,
    sortCode,
    tagsString,
    q,
    nutritionKeyString,
    typesString,
    ingredientsString,
    countryString,
  ] as const;

  const queryKeyString = JSON.stringify([
    "recipes",
    dishTypeCode,
    sortCode,
    tagCodes,
    q,
    nutritionKeyString,
    typesString,
    ingredientsString,
    creatorCountryTags,
  ]);

  return {
    dishTypeCode,
    sortCode,
    tagCodes,
    ingredientIds,
    creatorCountryTags,
    q,
    nutritionQueryParams,
    types,
    queryKey,
    queryKeyString,
  };
};
