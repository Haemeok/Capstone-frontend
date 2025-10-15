"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  DISH_TYPE_CODES,
  SORT_TYPE_CODES,
  TAG_CODES,
  TAGS_BY_CODE,
} from "@/shared/config/constants/recipe";

export const useSearchState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const sortCode = searchParams.get("sort") || "DESC";
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
      if (Array.isArray(value)) {
        newParams.delete(key);
        value.forEach((v) => newParams.append(key, v));
      } else {
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
      const cleanTag = tag.replace(/^[\u{1F000}-\u{1F9FF}]\s/u, "").trim();
      return TAG_CODES[cleanTag as keyof typeof TAG_CODES] || cleanTag;
    });
    updateSearchParams({ tags: codes });
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

    handleSearchSubmit,
    handleInputChange,
    setInputValue,
    updateDishType,
    updateSort,
    updateTags,
  };
};
