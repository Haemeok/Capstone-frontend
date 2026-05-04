import ArticleWithToc from "@/shared/ui/article/ArticleWithToc";
import type { TocItem } from "@/shared/ui/article/types";

import type { SavedCurationRecord } from "@/entities/curation";
import type { StaticRecipe } from "@/entities/recipe/model/types";

import { alegreya } from "@/features/archetype/ui/fonts";

import { enrichBodyMarkdown } from "../lib/enrichBody";
import { CurationCategoryLabel } from "./CurationCategoryLabel";
import { CurationMarkdown } from "./CurationMarkdown";

const formatTocTitle = (r: StaticRecipe): string => {
  const channel = r.youtubeChannelName?.trim();
  return channel ? `${channel} · ${r.title}` : r.title;
};

const TOC_ACCENT = "bg-green-900/10 font-semibold text-green-900";

type CurationArticleProps = {
  data: SavedCurationRecord;
  recipes: Array<StaticRecipe | null>;
};

export const CurationArticle = ({ data, recipes }: CurationArticleProps) => {
  const enriched = enrichBodyMarkdown(data.markdown);

  const tocItems: TocItem[] = recipes
    .map((r, i) => (r ? { id: `recipe-${i}`, title: formatTocTitle(r) } : null))
    .filter((x): x is TocItem => x !== null);

  return (
    <div className="px-5 pt-10 pb-20 md:px-6 md:pt-20">
      <header className="mx-auto max-w-3xl text-center">
        <CurationCategoryLabel category={data.category} />
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-pretty break-keep text-gray-900 md:text-4xl">
          {data.h1}
        </h1>
        {data.dek && (
          <p className="mt-4 text-base leading-relaxed text-pretty break-keep text-gray-600 md:text-lg">
            {data.dek}
          </p>
        )}
        <p className={`${alegreya.variable} mt-4 text-sm text-gray-500`}>
          <span
            className="text-base tracking-tight text-gray-700"
            style={{ fontFamily: "var(--font-alegreya), serif" }}
          >
            RECIPIO
          </span>{" "}
          레시피오 {data.category} 에디터
        </p>
      </header>

      {data.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.thumbnailUrl}
          alt={data.h1}
          className="mx-auto mt-8 aspect-[16/9] w-full max-w-4xl rounded-lg object-cover"
        />
      )}

      <div className="mt-10">
        {tocItems.length > 0 ? (
          <ArticleWithToc
            items={tocItems}
            accentClassName={TOC_ACCENT}
            layout="wide"
          >
            <CurationMarkdown markdown={enriched} recipes={recipes} />
          </ArticleWithToc>
        ) : (
          <article className="mx-auto w-full max-w-4xl">
            <CurationMarkdown markdown={enriched} recipes={recipes} />
          </article>
        )}
      </div>
    </div>
  );
};
