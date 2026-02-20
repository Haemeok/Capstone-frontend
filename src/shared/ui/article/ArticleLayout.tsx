import { type ReactNode } from "react";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { TocItem } from "./types";
import ArticleWithToc from "./ArticleWithToc";

type ArticleLayoutProps = {
  title: string;
  subtitle?: string;
  date?: string;
  tocItems?: TocItem[];
  children: ReactNode;
};

const ArticleLayout = ({
  title,
  subtitle,
  date,
  tocItems,
  children,
}: ArticleLayoutProps) => {
  const hasToc = tocItems && tocItems.length > 0;

  return (
    <Container maxWidth={hasToc ? "5xl" : "3xl"} className="pb-20">
      <div className="py-2 md:hidden">
        <PrevButton />
      </div>

      <header className="pb-8 pt-4 md:pt-8">
        {subtitle && (
          <span className="text-sm font-medium text-olive-light">
            {subtitle}
          </span>
        )}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {title}
        </h1>
        {date && (
          <p className="mt-3 text-sm text-gray-400">최종 수정일 {date}</p>
        )}
      </header>

      {hasToc ? (
        <ArticleWithToc items={tocItems}>{children}</ArticleWithToc>
      ) : (
        <div className="space-y-10">{children}</div>
      )}
    </Container>
  );
};

export default ArticleLayout;
