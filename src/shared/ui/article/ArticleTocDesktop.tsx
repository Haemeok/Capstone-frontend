"use client";

import type { TocItem } from "./types";
import ArticleTocList from "./ArticleTocList";

type ArticleTocDesktopProps = {
  items: TocItem[];
  activeId: string | null;
  onScrollToSection: (id: string) => void;
};

const ArticleTocDesktop = ({
  items,
  activeId,
  onScrollToSection,
}: ArticleTocDesktopProps) => {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 w-52">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          목차
        </p>
        <ArticleTocList
          items={items}
          activeId={activeId}
          onScrollToSection={onScrollToSection}
        />
      </div>
    </aside>
  );
};

export default ArticleTocDesktop;
