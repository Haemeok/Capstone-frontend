import {
  NUTRITION_RANGES,
  NutritionFilterKey,
} from "@/shared/config/constants/recipe";

export type NutritionRangeValue = [number, number];

export type NutritionFilterValues = {
  [K in NutritionFilterKey]?: NutritionRangeValue;
};

export const parseNutritionParams = (
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): NutritionFilterValues => {
  const params: NutritionFilterValues = {};

  const getParam = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key);
    }
    const value = searchParams[key];
    return typeof value === "string" ? value : null;
  };

  Object.keys(NUTRITION_RANGES).forEach((key) => {
    const filterKey = key as NutritionFilterKey;
    const minParam = getParam(
      `min${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`
    );
    const maxParam = getParam(
      `max${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`
    );

    if (minParam !== null || maxParam !== null) {
      params[filterKey] = [
        minParam ? parseInt(minParam) : NUTRITION_RANGES[filterKey].min,
        maxParam ? parseInt(maxParam) : NUTRITION_RANGES[filterKey].max,
      ];
    }
  });

  return params;
};

export const convertNutritionToQueryParams = (
  nutritionParams: NutritionFilterValues
): Record<string, number> => {
  const queryParams: Record<string, number> = {};

  Object.entries(nutritionParams).forEach(([key, value]) => {
    const filterKey = key as NutritionFilterKey;
    const capitalizedKey =
      filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
    if (value) {
      queryParams[`min${capitalizedKey}`] = value[0];
      queryParams[`max${capitalizedKey}`] = value[1];
    }
  });

  return queryParams;
};

export const parseTypes = (
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): string[] => {
  const getParam = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key);
    }
    const value = searchParams[key];
    return typeof value === "string" ? value : null;
  };

  const typesParam = getParam("types");
  return typesParam
    ? typesParam.split(",").filter(Boolean)
    : ["USER", "AI", "YOUTUBE"];
};
