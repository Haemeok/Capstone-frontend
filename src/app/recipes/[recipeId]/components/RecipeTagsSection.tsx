import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { TAG_DEFINITIONS } from "@/shared/config/constants/recipe";

type RecipeTagsSectionProps = {
  tags: string[];
};

export default function RecipeTagsSection({ tags }: RecipeTagsSectionProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 mb-6">
      <h2 className="text-dark mb-3 text-lg font-bold">태그</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const tagDef = TAG_DEFINITIONS.find(
            (def) => `${def.emoji} ${def.name}` === tag
          );

          if (!tagDef) {
            return (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-500"
              >
                {tag}
              </span>
            );
          }

          return (
            <Link
              key={tag}
              href={`/recipes/category/${tagDef.code}`}
              className="border-olive-light/70 text-dark group inline-flex items-center gap-1.5 rounded-full border bg-white py-2 pr-2.5 pl-3.5 text-sm font-medium shadow-sm transition-all active:scale-[0.97] active:shadow-none"
            >
              <span>{tag}</span>
              <ChevronRight
                className="text-olive-light h-3.5 w-3.5 transition-transform group-active:translate-x-0.5"
                strokeWidth={2.5}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
