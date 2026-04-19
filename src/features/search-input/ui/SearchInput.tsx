"use client";

import React, { useEffect, useState } from "react";

import { Search, X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { useSearchQuery } from "../model";

const PLACEHOLDER_INTERVAL_MS = 3000;

const BREAKFAST_PLACEHOLDERS = [
  "아침에 든든한 사과 레시피",
  "활기찬 시작, 계란 레시피",
  "햇살 같은 한 그릇, 오트밀 레시피",
  "잠 깨우는 한 입, 그릭요거트 레시피",
];

const LUNCH_PLACEHOLDERS = [
  "에너지 가득 채우는 닭가슴살 레시피",
  "바쁜 날엔 후딱, 비빔밥 레시피",
  "맑은 국물 한 그릇, 미역국 레시피",
  "든든한 한 끼, 김치찌개 레시피",
];

const DINNER_PLACEHOLDERS = [
  "포근한 저녁, 된장찌개 레시피",
  "오늘의 마무리, 삼겹살 레시피",
  "따뜻한 한 그릇, 칼국수 레시피",
  "온 가족 모이는 날, 잡채 레시피",
];

const MORNING_HOUR_START = 5;
const LUNCH_HOUR_START = 11;
const DINNER_HOUR_START = 17;

const getPlaceholdersForHour = (hour: number): string[] => {
  if (hour >= MORNING_HOUR_START && hour < LUNCH_HOUR_START) {
    return BREAKFAST_PLACEHOLDERS;
  }
  if (hour >= LUNCH_HOUR_START && hour < DINNER_HOUR_START) {
    return LUNCH_PLACEHOLDERS;
  }
  return DINNER_PLACEHOLDERS;
};

const useRollingPlaceholder = () => {
  const [placeholder, setPlaceholder] = useState<string>(
    () => getPlaceholdersForHour(new Date().getHours())[0]
  );

  useEffect(() => {
    const list = getPlaceholdersForHour(new Date().getHours());
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % list.length;
      setPlaceholder(list[index]);
    }, PLACEHOLDER_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return placeholder;
};

type SearchInputProps = {
  onFocus?: () => void;
};

export const SearchInput = ({ onFocus }: SearchInputProps) => {
  const { inputValue, setInputValue, submitSearch } = useSearchQuery();
  const placeholder = useRollingPlaceholder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(inputValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    triggerHaptic("Light");
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2.5 rounded-full bg-gray-100 px-4 py-2.5">
        <Search
          className="h-5 w-5 shrink-0 text-gray-500"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder={placeholder}
          aria-label="레시피 검색"
          className="min-w-0 flex-1 bg-transparent text-base text-gray-800 placeholder:text-gray-500 focus:outline-none"
          value={inputValue}
          onChange={handleChange}
          onFocus={onFocus}
        />
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700",
            !inputValue && "invisible"
          )}
          aria-label="입력 지우기"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
