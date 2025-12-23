"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  DISH_TYPE_CODES,
  SORT_TYPE_CODES,
  TAG_DEFINITIONS,
  TAGS_BY_CODE,
  NUTRITION_RANGES,
  NutritionFilterKey,
} from "@/shared/config/constants/recipe";

type NutritionFilterValues = {
  [K in NutritionFilterKey]: [number, number];
};

export const useSearchState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const sortCode = searchParams.get("sort") || "createdAt,DESC";
  const dishTypeCode = searchParams.get("dishType") || null;
  const tagCodes = searchParams.getAll("tags") || [];

  const sort =
    Object.keys(SORT_TYPE_CODES).find(
      (key) => SORT_TYPE_CODES[key as keyof typeof SORT_TYPE_CODES] === sortCode
    ) || "최신순";

  const dishType = dishTypeCode
    ? Object.keys(DISH_TYPE_CODES).find(
        (key) =>
          DISH_TYPE_CODES[key as keyof typeof DISH_TYPE_CODES] === dishTypeCode
      ) || "전체"
    : "전체";

  const tags = tagCodes.map((code) => {
    const tag = TAGS_BY_CODE[code as keyof typeof TAGS_BY_CODE];
    return tag ? `${tag.emoji} ${tag.name}` : code;
  });

  const [inputValue, setInputValue] = useState(q);

  const updateSearchParams = (
    newFilters: Record<string, string | string[]>
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      newParams.delete(key);

      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, v));
      } else if (value) {
        newParams.set(key, value);
      }
    });

    router.replace(`/search?${newParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ q: inputValue });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const updateDishType = (value: string) => {
    const code = DISH_TYPE_CODES[value as keyof typeof DISH_TYPE_CODES];
    updateSearchParams({ dishType: code || "" });
  };

  const updateSort = (value: string) => {
    const code = SORT_TYPE_CODES[value as keyof typeof SORT_TYPE_CODES];
    updateSearchParams({ sort: code });
  };

  const updateTags = (value: string[]) => {
    const codes = value.map((tag) => {
      const matchedTag = TAG_DEFINITIONS.find(
        (def) => tag === `${def.emoji} ${def.name}` || tag === def.name
      );
      return matchedTag ? matchedTag.code : tag;
    });
    updateSearchParams({ tags: codes });
  };

  const nutritionParams: Partial<NutritionFilterValues> = {};
  Object.keys(NUTRITION_RANGES).forEach((key) => {
    const filterKey = key as NutritionFilterKey;
    const minParam = searchParams.get(`min${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`);
    const maxParam = searchParams.get(`max${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`);

    if (minParam !== null || maxParam !== null) {
      nutritionParams[filterKey] = [
        minParam ? parseInt(minParam) : NUTRITION_RANGES[filterKey].min,
        maxParam ? parseInt(maxParam) : NUTRITION_RANGES[filterKey].max,
      ];
    }
  });

  const isNutritionDirty = Object.keys(nutritionParams).length > 0;

  const updateNutritionFilters = (values: Partial<NutritionFilterValues>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.keys(NUTRITION_RANGES).forEach((key) => {
      const filterKey = key as NutritionFilterKey;
      const capitalizedKey = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
      newParams.delete(`min${capitalizedKey}`);
      newParams.delete(`max${capitalizedKey}`);
    });

    Object.entries(values).forEach(([key, value]) => {
      const filterKey = key as NutritionFilterKey;
      const capitalizedKey = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
      if (value) {
        newParams.set(`min${capitalizedKey}`, value[0].toString());
        newParams.set(`max${capitalizedKey}`, value[1].toString());
      }
    });

    router.replace(`/search?${newParams.toString()}`);
  };

  const clearNutritionFilters = () => {
    updateNutritionFilters({});
  };

  return {
    q,
    sort,
    dishType,
    tags,
    inputValue,

    sortCode,
    dishTypeCode,
    tagCodes,

    nutritionParams,
    isNutritionDirty,

    handleSearchSubmit,
    handleInputChange,
    setInputValue,
    updateDishType,
    updateSort,
    updateTags,
    updateNutritionFilters,
    clearNutritionFilters,
  };
};
