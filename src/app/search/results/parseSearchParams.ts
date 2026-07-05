import { COUNTRY_DEFINITIONS } from "@/shared/config/constants/recipe";
import { dishTypeCodec, sortCodec } from "@/shared/lib/filters";
import {
  convertNutritionToQueryParams,
  parseNutritionParams,
  parseTypes,
} from "@/shared/lib/nutrition/parseNutritionParams";

import type {
  CreatorCountryTag,
  RecipeItemsQueryParams,
} from "@/entities/recipe/model/types";

export type SearchResultsSearchParams = {
  page?: string;
  q?: string;
  sort?: string;
  dishType?: string;
  tags?: string | string[];
  types?: string;
  minCost?: string;
  maxCost?: string;
  minCalories?: string;
  maxCalories?: string;
  minCarb?: string;
  maxCarb?: string;
  minProtein?: string;
  maxProtein?: string;
  minFat?: string;
  maxFat?: string;
  minSugar?: string;
  maxSugar?: string;
  minSodium?: string;
  maxSodium?: string;
  ingredientIds?: string;
  creatorCountryTags?: string;
};

export type ParsedSearchParams = {
  query: RecipeItemsQueryParams;
  page: number;
  q: string;
  dishTypeCode: string | null;
  sortCode: string;
  tags: string[];
  types: string[];
  ingredientIds: string[];
  creatorCountryTags: CreatorCountryTag[];
  nutritionQueryParams: Record<string, number>;
};

export const parseSearchQueryParams = (
  params: SearchResultsSearchParams
): ParsedSearchParams => {
  const page = Math.max(0, parseInt(params.page || "0", 10) || 0);
  const q = params.q || "";

  const tags = params.tags
    ? typeof params.tags === "string"
      ? params.tags.split(",").filter(Boolean)
      : params.tags
    : [];

  const sortCode =
    sortCodec.encode(sortCodec.decode(params.sort ?? null)) ??
    "popularityScore,DESC";
  const dishTypeCode = dishTypeCodec.encode(
    dishTypeCodec.decode(params.dishType ?? null)
  );

  const nutritionParams = parseNutritionParams(params);
  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const types = parseTypes(params);

  const ingredientIds = params.ingredientIds
    ? params.ingredientIds.split(",").filter(Boolean)
    : [];

  const creatorCountryTags = (
    params.creatorCountryTags
      ? params.creatorCountryTags.split(",").filter(Boolean)
      : []
  ).filter((code) =>
    COUNTRY_DEFINITIONS.some((def) => def.code === code)
  ) as CreatorCountryTag[];

  return {
    query: {
      key: "search",
      page,
      q,
      sort: sortCode,
      dishType: dishTypeCode || undefined,
      tags,
      types,
      ingredientIds: ingredientIds.length > 0 ? ingredientIds : undefined,
      creatorCountryTags:
        creatorCountryTags.length > 0 ? creatorCountryTags : undefined,
      ...nutritionQueryParams,
    },
    page,
    q,
    dishTypeCode,
    sortCode,
    tags,
    types,
    ingredientIds,
    creatorCountryTags,
    nutritionQueryParams,
  };
};
