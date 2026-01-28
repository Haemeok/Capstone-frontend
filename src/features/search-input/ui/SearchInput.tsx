"use client";

import React from "react";

import { Search } from "lucide-react";

import { useSearchQuery } from "../model";

export const SearchInput = () => {
  const { inputValue, setInputValue, submitSearch } = useSearchQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(inputValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-2xl bg-gray-100 p-1">
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="어떤 레시피를 찾으세요?"
            aria-label="레시피 검색"
            className="min-w-0 flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
            value={inputValue}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
};
