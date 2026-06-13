"use client";

import React, { useEffect, useRef, useState } from "react";

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";
import type { Locale } from "@/shared/i18n/types";
import {
  useSearchDiscoveryDict,
  useSearchDiscoveryLocale,
} from "@/shared/i18n/useSearchDiscoveryDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { useSearchQuery } from "../model";

const PLACEHOLDER_INTERVAL_MS = 8000;
const SLIDE_DURATION_S = 0.6;
const SLIDE_Y_OFFSET = 8;
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const;

export const MAX_PLACEHOLDER_CHARS: Record<Locale, number> = {
  ko: 20,
  ja: 24,
  en: 40,
};

const MORNING_HOUR_START = 5;
const LUNCH_HOUR_START = 11;
const DINNER_HOUR_START = 17;

export const getPlaceholders = (locale: Locale, hour: number): string[] => {
  const p = searchDiscoveryMessages[locale].placeholders;
  if (hour >= MORNING_HOUR_START && hour < LUNCH_HOUR_START) return p.breakfast;
  if (hour >= LUNCH_HOUR_START && hour < DINNER_HOUR_START) return p.lunch;
  return p.dinner;
};

type SearchInputProps = {
  onFocus?: () => void;
  autoFocus?: boolean;
};

export const SearchInput = ({ onFocus, autoFocus }: SearchInputProps) => {
  const t = useSearchDiscoveryDict();
  const locale = useSearchDiscoveryLocale();
  const { inputValue, setInputValue, submitSearch } = useSearchQuery();
  const [placeholders] = useState<string[]>(() =>
    getPlaceholders(locale, new Date().getHours())
  );
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (placeholders.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, PLACEHOLDER_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [placeholders.length]);

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
  }, [autoFocus]);

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
  const safeIndex = placeholders.length > 0 ? index % placeholders.length : 0;
  const currentPlaceholder = placeholders[safeIndex];

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-2">
        <Search
          className="text-ink-muted h-4 w-4 shrink-0"
          aria-hidden="true"
        />
        <div className="relative flex min-w-0 flex-1 items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder=""
            aria-label={t.searchInputAria}
            className="text-ink-sub min-w-0 flex-1 bg-transparent text-base focus:outline-none"
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
                className="text-ink-muted pointer-events-none absolute inset-0 flex items-center overflow-hidden text-sm whitespace-nowrap"
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
            "text-ink-muted hover:text-ink-sub rounded-full p-0.5 transition-colors hover:bg-gray-300",
            !inputValue && "invisible"
          )}
          aria-label={t.searchClearAria}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
