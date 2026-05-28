"use client";

import { type ReactNode, useMemo } from "react";

import ArticleTocDesktop from "./ArticleTocDesktop";
import ArticleTocMobileFab from "./ArticleTocMobileFab";
import ArticleTocList from "./ArticleTocList";
import { useActiveSection } from "./hooks/useActiveSection";
import type { TocItem } from "./types";

type ArticleWithTocProps = {
  items: TocItem[];
  children: ReactNode;
  accentClassName?: string;
  layout?: "compact" | "wide";
};

const ArticleWithToc = ({
  items,
  children,
  accentClassName,
  layout = "compact",
}: ArticleWithTocProps) => {
  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);
  const { activeId, scrollToSection } = useActiveSection(sectionIds);

  if (layout === "wide") {
    return (
      <div className="relative flex justify-center gap-8">
        <article className="min-w-0 w-full max-w-4xl space-y-10">
          {children}
        </article>
        <aside className="hidden xl:block">
          <div className="sticky top-24 w-52">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              목차
            </p>
            <ArticleTocList
              items={items}
              activeId={activeId}
              onScrollToSection={scrollToSection}
              accentClassName={accentClassName}
            />
          </div>
        </aside>
        <ArticleTocMobileFab
          items={items}
          activeId={activeId}
          onScrollToSection={scrollToSection}
          accentClassName={accentClassName}
          visibilityClassName="xl:hidden"
        />
      </div>
    );
  }

  return (
    <div className="relative md:grid md:grid-cols-[1fr_auto] md:gap-8">
      <article className="min-w-0 space-y-10">{children}</article>
      <ArticleTocDesktop
        items={items}
        activeId={activeId}
        onScrollToSection={scrollToSection}
        accentClassName={accentClassName}
      />
      <ArticleTocMobileFab
        items={items}
        activeId={activeId}
        onScrollToSection={scrollToSection}
        accentClassName={accentClassName}
      />
    </div>
  );
};

export default ArticleWithToc;
