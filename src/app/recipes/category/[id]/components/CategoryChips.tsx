"use client";

import {
  TAG_DEFINITIONS,
  type TagCode,
} from "@/shared/config/constants/recipe";
import { LocalizedLink } from "@/shared/i18n";
import { useCategoryDict } from "@/shared/i18n/useCategoryDict";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";

type CategoryChipsProps = {
  currentCode: TagCode;
};

const CategoryChips = ({ currentCode }: CategoryChipsProps) => {
  const dict = useCategoryDict();
  const { label } = useTaxonomy();

  return (
    <nav
      aria-label={dict.navAriaLabel}
      className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3"
    >
      {TAG_DEFINITIONS.map((tag) => {
        const isSelected = tag.code === currentCode;
        return (
          <LocalizedLink
            key={tag.code}
            href={`/recipes/category/${tag.code}`}
            aria-current={isSelected ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-transform active:scale-[0.97]",
              isSelected
                ? "bg-olive-light text-white"
                : "text-ink-sub bg-gray-100"
            )}
          >
            # {label(tag.code, "tags")}
          </LocalizedLink>
        );
      })}
    </nav>
  );
};

export default CategoryChips;
