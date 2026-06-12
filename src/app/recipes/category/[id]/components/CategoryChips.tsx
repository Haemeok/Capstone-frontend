import Link from "next/link";

import {
  TAG_DEFINITIONS,
  type TagCode,
} from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";

type CategoryChipsProps = {
  currentCode: TagCode;
};

const CategoryChips = ({ currentCode }: CategoryChipsProps) => {
  return (
    <nav
      aria-label="카테고리"
      className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3"
    >
      {TAG_DEFINITIONS.map((tag) => {
        const isSelected = tag.code === currentCode;
        return (
          <Link
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
            # {tag.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default CategoryChips;
