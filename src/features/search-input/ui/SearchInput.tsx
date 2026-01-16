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
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="search"
        placeholder="레시피를 검색하세요"
        aria-label="레시피 검색"
        className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-4 focus:outline-none"
        value={inputValue}
        onChange={handleChange}
      />

      <button
        type="submit"
        aria-label="검색"
        className="absolute top-1/2 right-3 -translate-y-1/2 p-2"
      >
        <Search size={18} className="text-gray-400" aria-hidden="true" />
      </button>
    </form>
  );
};
