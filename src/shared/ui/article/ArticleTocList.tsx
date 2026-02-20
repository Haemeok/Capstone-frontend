"use client";

import { cn } from "@/shared/lib/utils";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { TocItem } from "./types";

type ArticleTocListProps = {
  items: TocItem[];
  activeId: string | null;
  onScrollToSection: (id: string) => void;
  onItemClick?: () => void;
};

const ArticleTocList = ({
  items,
  activeId,
  onScrollToSection,
  onItemClick,
}: ArticleTocListProps) => {
  const handleClick = (id: string) => {
    triggerHaptic("Light");
    onScrollToSection(id);
    onItemClick?.();
  };

  return (
    <nav aria-label="목차">
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={cn(
                  "flex w-full min-h-[44px] cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200",
                  isActive
                    ? "bg-olive-light/10 font-semibold text-olive-light"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ArticleTocList;
