"use client";

import { format, LocalizedLink } from "@/shared/i18n";
import { useCategoryDict } from "@/shared/i18n/useCategoryDict";

type CategoryEmptyStateProps = {
  tagName: string;
};

const CategoryEmptyState = ({ tagName }: CategoryEmptyStateProps) => {
  const dict = useCategoryDict();

  return (
    <div className="flex flex-col items-start gap-3 px-4 pt-16 pb-10">
      <p className="text-ink text-base font-semibold">
        {format(dict.emptyTitle, { tagName })}
      </p>
      <p className="text-ink-muted text-sm">{dict.emptySubtitle}</p>
      <LocalizedLink
        href="/recipes/new"
        className="bg-olive-light active:bg-olive-dark mt-1 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold text-white transition-colors"
      >
        {dict.emptyCta}
      </LocalizedLink>
    </div>
  );
};

export default CategoryEmptyState;
