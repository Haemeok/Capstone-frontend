"use client";

import React from "react";

import { Search, X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { useSearchQuery } from "../model";

type SearchInputProps = {
  onFocus?: () => void;
};

export const SearchInput = ({ onFocus }: SearchInputProps) => {
  const { inputValue, setInputValue, submitSearch } = useSearchQuery();

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
      <div className="rounded-2xl bg-gray-100 p-1">
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="어떤 레시피를 찾으세요?"
            aria-label="레시피 검색"
            className="min-w-0 flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
            value={inputValue}
            onChange={handleChange}
            onFocus={onFocus}
          />
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600",
              !inputValue && "invisible"
            )}
            aria-label="입력 지우기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </form>
  );
};
