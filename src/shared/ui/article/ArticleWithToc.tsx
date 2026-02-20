"use client";

import { type ReactNode, useMemo } from "react";

import type { TocItem } from "./types";
import { useActiveSection } from "./hooks/useActiveSection";
import ArticleTocDesktop from "./ArticleTocDesktop";
import ArticleTocMobileFab from "./ArticleTocMobileFab";

type ArticleWithTocProps = {
  items: TocItem[];
  children: ReactNode;
};

const ArticleWithToc = ({ items, children }: ArticleWithTocProps) => {
  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);
  const { activeId, scrollToSection } = useActiveSection(sectionIds);

  return (
    <div className="relative md:grid md:grid-cols-[1fr_auto] md:gap-8">
      <article className="min-w-0 space-y-10">{children}</article>
      <ArticleTocDesktop
        items={items}
        activeId={activeId}
        onScrollToSection={scrollToSection}
      />
      <ArticleTocMobileFab
        items={items}
        activeId={activeId}
        onScrollToSection={scrollToSection}
      />
    </div>
  );
};

export default ArticleWithToc;
