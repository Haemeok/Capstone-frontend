"use client";

import { useRouter } from "next/navigation";

import { X } from "lucide-react";

import { useRecentSearches } from "@/shared/hooks/useRecentSearches";
import { triggerHaptic } from "@/shared/lib/bridge";

const RecentSearchChips = () => {
  const router = useRouter();
  const { searches, isLoaded, removeSearch, clearAll } = useRecentSearches();

  if (!isLoaded || searches.length === 0) {
    return null;
  }

  const handleChipClick = (query: string) => {
    triggerHaptic("Light");
    router.push(`/search/results?q=${encodeURIComponent(query)}&types=USER,AI,YOUTUBE`);
  };

  const handleRemove = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    triggerHaptic("Light");
    removeSearch(query);
  };

  const handleClearAll = () => {
    triggerHaptic("Light");
    clearAll();
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">최근 검색어</h3>
        <button
          onClick={handleClearAll}
          className="cursor-pointer text-sm text-gray-400 active:text-gray-600"
        >
          지우기
        </button>
      </div>

      <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
        {searches.map((query) => (
          <button
            key={query}
            onClick={() => handleChipClick(query)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 active:bg-gray-200"
          >
            <span className="whitespace-nowrap">{query}</span>
            <X
              size={14}
              className="text-gray-400"
              onClick={(e) => handleRemove(e, query)}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default RecentSearchChips;
