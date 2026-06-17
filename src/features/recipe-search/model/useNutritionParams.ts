"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

import {
  NUTRITION_RANGES,
  type NutritionFilterKey,
} from "@/shared/config/constants/recipe";
import { useLocalizedRouter } from "@/shared/i18n";
import { countryCodec } from "@/shared/lib/filters";
import {
  type NutritionFilterValues,
  parseNutritionParams,
  parseTypes,
} from "@/shared/lib/nutrition/parseNutritionParams";

export const useNutritionParams = () => {
  const router = useLocalizedRouter();
  const searchParams = useSearchParams();

  const nutritionParams = parseNutritionParams(searchParams);

  const types = parseTypes(searchParams);

  const countries = countryCodec.decode(searchParams.get("creatorCountryTags"));

  const isNutritionDirty = Object.keys(nutritionParams).length > 0;

  const updateNutritionAndTypes = useCallback(
    (
      nutritionValues: Partial<NutritionFilterValues>,
      newTypes: string[],
      newCountries: string[] = []
    ) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.keys(NUTRITION_RANGES).forEach((key) => {
        const filterKey = key as NutritionFilterKey;
        const capitalizedKey =
          filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
        newParams.delete(`min${capitalizedKey}`);
        newParams.delete(`max${capitalizedKey}`);
      });

      Object.entries(nutritionValues).forEach(([key, value]) => {
        const filterKey = key as NutritionFilterKey;
        const capitalizedKey =
          filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
        if (value) {
          newParams.set(`min${capitalizedKey}`, value[0].toString());
          newParams.set(`max${capitalizedKey}`, value[1].toString());
        }
      });

      if (newTypes.length > 0) {
        newParams.set("types", newTypes.join(","));
      } else {
        newParams.delete("types");
      }

      const countryParam = countryCodec.encode(newCountries);
      if (countryParam) {
        newParams.set("creatorCountryTags", countryParam);
      } else {
        newParams.delete("creatorCountryTags");
      }

      router.replace(`/search/results?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  return {
    nutritionParams,
    types,
    countries,
    isNutritionDirty,
    updateNutritionAndTypes,
  };
};
