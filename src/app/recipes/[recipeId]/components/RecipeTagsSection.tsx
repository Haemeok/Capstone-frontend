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
                className="border-olive-light bg-olive-light/10 text-dark rounded-full border px-3 py-1.5 text-sm"
              >
                {tag}
              </span>
            );
          }

          return (
            <Link
              key={tag}
              href={`/recipes/category/${tagDef.code}`}
              className="border-olive-light bg-olive-light/10 text-dark hover:bg-olive-light rounded-full border px-3 py-1.5 text-sm transition-colors hover:text-white"
            >
              {tag}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
