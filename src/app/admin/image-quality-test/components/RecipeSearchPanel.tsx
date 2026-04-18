"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getRecipeItems } from "@/entities/recipe/model/api";
import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

type Props = {
  selectedId: string | null;
  onSelect: (recipe: DetailedRecipeGridItem) => void;
};

const PLACEHOLDER = "레시피 이름 (예: 김치찌개)";

export const RecipeSearchPanel = ({ selectedId, onSelect }: Props) => {
  const [keyword, setKeyword] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["admin-image-test-search", submitted],
    queryFn: () =>
      getRecipeItems({ q: submitted, sort: "likeCount,desc", size: 20 }),
    enabled: submitted.length > 0,
    staleTime: 60_000,
  });

  const items = data?.content ?? [];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(keyword.trim());
        }}
        className="mb-3 flex gap-2"
      >
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={PLACEHOLDER}
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
        />
        <button
          type="submit"
          className="rounded-xl bg-olive-light px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          검색
        </button>
      </form>

      {isFetching && <p className="text-xs text-gray-400">검색 중…</p>}

      {!isFetching && submitted.length > 0 && items.length === 0 && (
        <p className="text-xs text-gray-400">검색 결과가 없습니다.</p>
      )}

      <div className="max-h-[360px] space-y-2 overflow-y-auto">
        {items.map((r) => {
          const isSelected = r.id === selectedId;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className={`flex w-full items-center gap-3 rounded-xl border-2 p-2 text-left text-sm transition-colors ${
                isSelected
                  ? "border-olive-light bg-olive-light/5"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              {r.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.imageUrl}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <span className="truncate text-gray-900">{r.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
