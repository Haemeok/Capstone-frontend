"use client";

import { useEffect, useMemo, useState } from "react";

type FilterItem = { q: string };
type AllowlistData = { totalPages: number; pages: FilterItem[] };

const PAGE_SIZE = 30;

type FilterBrowserProps = {
  onSelect: (query: string) => void;
};

export const FilterBrowser = ({ onSelect }: FilterBrowserProps) => {
  const [data, setData] = useState<AllowlistData | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    import("@/shared/config/seo/sitemap-allowlist.json").then((mod) => {
      setData(mod.default as AllowlistData);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data.pages;
    const keyword = search.trim().toLowerCase();
    return data.pages.filter((item) => item.q.toLowerCase().includes(keyword));
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!data) {
    return <div className="py-12 text-center text-gray-400">필터 데이터 로딩 중...</div>;
  }

  return (
    <div>
      {/* 검색 */}
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        placeholder="필터 조합 검색... (예: 자취, 전자레인지, 파스타)"
        className="mb-4 w-full rounded-xl border border-gray-200 p-4 text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light"
      />

      {/* 카운트 */}
      <p className="mb-3 text-sm text-gray-500">
        총 {filtered.length.toLocaleString()}개 중 {page * PAGE_SIZE + 1}-
        {Math.min((page + 1) * PAGE_SIZE, filtered.length)}
      </p>

      {/* 필터 목록 */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pageItems.map((item) => (
          <button
            key={item.q}
            onClick={() => onSelect(item.q)}
            className="rounded-xl border border-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-all hover:border-olive-light hover:bg-olive-light/5"
          >
            {item.q}
          </button>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
          >
            이전
          </button>
          <span className="text-sm text-gray-500">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};
