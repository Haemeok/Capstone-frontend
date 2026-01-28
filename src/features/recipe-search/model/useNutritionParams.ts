"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  parseNutritionParams,
  parseTypes,
  type NutritionFilterValues,
} from "@/shared/lib/nutrition/parseNutritionParams";
import {
  NUTRITION_RANGES,
  type NutritionFilterKey,
} from "@/shared/config/constants/recipe";

export const useNutritionParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nutritionParams = useMemo(
    () => parseNutritionParams(searchParams),
    [searchParams.toString()]
  );

  const types = useMemo(
    () => parseTypes(searchParams),
    [searchParams.toString()]
  );

  const isNutritionDirty = Object.keys(nutritionParams).length > 0;

  const updateNutritionAndTypes = useCallback(
    (nutritionValues: Partial<NutritionFilterValues>, newTypes: string[]) => {
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

      router.replace(`/search/results?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  return {
    nutritionParams,
    types,
    isNutritionDirty,
    updateNutritionAndTypes,
  };
};
