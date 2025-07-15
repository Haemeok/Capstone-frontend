"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  DISH_TYPE_CODES,
  SORT_TYPE_CODES,
  TAG_CODES,
  TAG_CODES_TO_NAME,
} from "@/shared/config/constants/recipe";

export const useSearchState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const sortCode = searchParams.get("sort") || "DESC";
  const dishTypeCode = searchParams.get("dishType") || null;
  const tagCodes = searchParams.getAll("tagNames") || [];

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

  const tagNames = tagCodes.map(
    (code) => TAG_CODES_TO_NAME[code as keyof typeof TAG_CODES_TO_NAME] || code
  );

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

  // 검색어 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ q: inputValue });
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 필터 변경 핸들러들
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
      // 이모지 제거 후 태그명 추출 (🏠, 🌼 등)
      const cleanTag = tag.replace(/^[\u{1F000}-\u{1F9FF}]\s/u, "").trim();
      return TAG_CODES[cleanTag as keyof typeof TAG_CODES] || cleanTag;
    });
    updateSearchParams({ tagNames: codes });
  };

  return {
    // 현재 상태 (화면 표시용)
    q,
    sort,
    dishType,
    tagNames,
    inputValue,

    // 코드 형태 상태 (API 호출용)
    sortCode,
    dishTypeCode,
    tagCodes,

    // 핸들러들
    handleSearchSubmit,
    handleInputChange,
    setInputValue,
    updateDishType,
    updateSort,
    updateTags,
  };
};
