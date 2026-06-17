"use client";

import { X } from "lucide-react";

import { useRecentSearches } from "@/shared/hooks/useRecentSearches";
import { useLocalizedRouter } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";

const RecentSearchChips = () => {
  const router = useLocalizedRouter();
  const { searches, isLoaded, removeSearch, clearAll } = useRecentSearches();
  const t = useSearchDiscoveryDict();

  if (!isLoaded || searches.length === 0) {
    return null;
  }

  const handleChipClick = (query: string) => {
    triggerHaptic("Light");
    router.push(buildSearchResultsUrl({ q: query }));
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
        <h3 className="text-ink-muted text-sm font-medium">
          {t.recentSearchTitle}
        </h3>
        <button
          onClick={handleClearAll}
          className="active:text-ink-sub cursor-pointer text-sm text-gray-400"
        >
          {t.clearAction}
        </button>
      </div>

      <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
        {searches.map((query) => (
          <button
            key={query}
            onClick={() => handleChipClick(query)}
            className="text-ink-sub flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2.5 text-sm font-medium active:bg-gray-200"
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
