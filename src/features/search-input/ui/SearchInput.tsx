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

// 모바일 입력창(≈280px, text-sm)에서 한 줄로 들어가는 총 글자 상한.
// 이 이상은 하단 `overflow-hidden whitespace-nowrap` 가 잘라내므로
// 핵심 키워드가 뒤로 밀리지 않도록 카피 단계에서 맞춰줄 것.
const MAX_PLACEHOLDER_CHARS = 20;

const BREAKFAST_PLACEHOLDERS = [
  '출근 전 든든한 "계란 레시피" 검색',
  '5분 완성 "토스트 레시피" 검색',
  '속 편한 "그릭요거트 레시피" 검색',
  '해장엔 따뜻한 "북엇국 레시피" 검색',
];

const LUNCH_PLACEHOLDERS = [
  '혼밥엔 든든 "김치찌개 레시피" 검색',
  '매콤한 불맛 "제육덮밥 레시피" 검색',
  '냉장고 털어 "비빔밥 레시피" 검색',
  '오늘은 바삭한 "돈까스 레시피" 검색',
];

const DINNER_PLACEHOLDERS = [
  '달콤한 양념 "불고기 레시피" 검색',
  '퇴근 후 "된장찌개 레시피" 검색',
  '불금엔 역시 "삼겹살 레시피" 검색',
  '얼큰 매콤한 "닭볶음탕 레시피" 검색',
];

if (process.env.NODE_ENV !== "production") {
  const overflow = [
    ...BREAKFAST_PLACEHOLDERS,
    ...LUNCH_PLACEHOLDERS,
    ...DINNER_PLACEHOLDERS,
  ].filter((s) => s.length > MAX_PLACEHOLDER_CHARS);
  if (overflow.length > 0) {
    console.warn(
      `[SearchInput] placeholder exceeds ${MAX_PLACEHOLDER_CHARS} chars:`,
      overflow
    );
  }
}

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
      <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-2">
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
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-nowrap text-sm text-gray-500"
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
