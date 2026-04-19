"use client";

import React, { useEffect, useState } from "react";

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { useSearchQuery } from "../model";

const PLACEHOLDER_INTERVAL_MS = 8000;
const SLIDE_DURATION_S = 0.6;
const SLIDE_Y_OFFSET = 8;
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const;

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

type SearchInputProps = {
  onFocus?: () => void;
};

export const SearchInput = ({ onFocus }: SearchInputProps) => {
  const { inputValue, setInputValue, submitSearch } = useSearchQuery();
  const [placeholders] = useState<string[]>(() =>
    getPlaceholdersForHour(new Date().getHours())
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (placeholders.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, PLACEHOLDER_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [placeholders.length]);

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

  const showRollingPlaceholder = inputValue.length === 0;
  const safeIndex =
    placeholders.length > 0 ? index % placeholders.length : 0;
  const currentPlaceholder = placeholders[safeIndex];

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 rounded-full bg-gray-200 px-3.5 py-2">
        <Search
          className="h-4 w-4 shrink-0 text-gray-500"
          aria-hidden="true"
        />
        <div className="relative flex min-w-0 flex-1 items-center">
          <input
            type="text"
            placeholder=""
            aria-label="레시피 검색"
            className="min-w-0 flex-1 bg-transparent text-base text-gray-700 focus:outline-none"
            value={inputValue}
            onChange={handleChange}
            onFocus={onFocus}
          />
          <AnimatePresence mode="wait">
            {showRollingPlaceholder && currentPlaceholder && (
              <motion.span
                key={safeIndex}
                initial={{ y: SLIDE_Y_OFFSET, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -SLIDE_Y_OFFSET, opacity: 0 }}
                transition={{ duration: SLIDE_DURATION_S, ease: SLIDE_EASE }}
                className="pointer-events-none absolute inset-0 flex items-center text-sm text-gray-500"
              >
                {currentPlaceholder}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "rounded-full p-0.5 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700",
            !inputValue && "invisible"
          )}
          aria-label="입력 지우기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
