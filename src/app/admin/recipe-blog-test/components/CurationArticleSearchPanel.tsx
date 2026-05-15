"use client";

import { useEffect, useRef, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { CURATION_CATEGORIES, type CurationCategory } from "@/entities/curation";
import {
  fetchCurationArticleList,
  type PublicCurationArticleListItemDto,
} from "@/features/curation/model/api.server";
import { triggerHaptic } from "@/shared/lib/bridge";

type Props = {
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
};

const PAGE_SIZE = 20;

const CATEGORY_OPTIONS: Array<{ value: CurationCategory | "all"; label: string }> = [
  { value: "all", label: "전체" },
  ...CURATION_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export const CurationArticleSearchPanel = ({ selectedSlug, onSelect }: Props) => {
  const [category, setCategory] = useState<CurationCategory | "all">("all");
  const sentinelRef = useRef<HTMLLIElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["admin", "curation-articles", category],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        fetchCurationArticleList({
          category: category === "all" ? undefined : category,
          page: pageParam,
          size: PAGE_SIZE,
        }),
      getNextPageParam: (last) => {
        const { number, totalPages } = last.page;
        return number + 1 < totalPages ? number + 1 : undefined;
      },
      staleTime: 60_000,
    });

  useEffect(() => {
    if (!hasNextPage) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const rows: PublicCurationArticleListItemDto[] =
    data?.pages.flatMap((p) => p.content) ?? [];

  const handleSelect = (slug: string) => {
    triggerHaptic("Light");
    onSelect(slug);
  };

  return (
    <aside className="space-y-2 rounded-2xl border border-gray-100 bg-white p-3">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as CurationCategory | "all")}
        className="w-full rounded border px-2 py-1 text-sm"
      >
        {CATEGORY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {isLoading ? (
        <p className="text-xs text-gray-500">로드 중…</p>
      ) : rows.length === 0 ? (
        <p className="text-xs text-gray-500">발행된 큐레이션이 없어요.</p>
      ) : (
        <ul className="space-y-1">
          {rows.map((r) => {
            const isSelected = r.slug === selectedSlug;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(r.slug)}
                  className={`w-full cursor-pointer rounded px-2 py-2 text-left text-sm hover:bg-gray-100 ${
                    isSelected ? "bg-amber-50 font-medium" : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900">{r.title}</p>
                  {r.description && (
                    <p className="line-clamp-2 text-xs text-gray-500">{r.description}</p>
                  )}
                  <p className="mt-1 text-[10px] text-gray-400">
                    {r.category ?? "-"} · {r.publishedAt.slice(0, 10)}
                  </p>
                </button>
              </li>
            );
          })}
          {hasNextPage && (
            <li ref={sentinelRef} className="py-3 text-center text-xs text-gray-400">
              더 불러오는 중…
            </li>
          )}
        </ul>
      )}
    </aside>
  );
};
