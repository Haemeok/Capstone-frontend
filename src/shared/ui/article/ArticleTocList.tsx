// i18n-ignore-file: ko 전용 라우트 전용 렌더
"use client";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type { TocItem } from "./types";

type ArticleTocListProps = {
  items: TocItem[];
  activeId: string | null;
  onScrollToSection: (id: string) => void;
  onItemClick?: () => void;
  accentClassName?: string;
};

const DEFAULT_ACCENT = "bg-olive-light/10 font-semibold text-olive-light";

const ArticleTocList = ({
  items,
  activeId,
  onScrollToSection,
  onItemClick,
  accentClassName = DEFAULT_ACCENT,
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
                  "flex min-h-[44px] w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200",
                  isActive
                    ? accentClassName
                    : "text-ink-muted hover:text-ink-sub hover:bg-gray-50"
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
