import ArticleWithToc from "@/shared/ui/article/ArticleWithToc";
import type { TocItem } from "@/shared/ui/article/types";

import type { SavedCurationRecord } from "@/entities/curation";
import type { StaticRecipe } from "@/entities/recipe/model/types";

import { enrichBodyMarkdown } from "../lib/enrichBody";
import { CurationCategoryLabel } from "./CurationCategoryLabel";
import { CurationMarkdown } from "./CurationMarkdown";

const formatTocTitle = (r: StaticRecipe): string => {
  const channel = r.youtubeChannelName?.trim();
  return channel ? `${channel} · ${r.title}` : r.title;
};

const toCategoryInitials = (category: string): string =>
  category
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

const formatPublishedDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
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
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-gray-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/web-app-manifest-192x192.png"
            alt=""
            className="h-5 w-5 rounded"
          />
          <span className="text-gray-700">레시피오</span>
          <span aria-hidden="true" className="text-gray-400">·</span>
          <span>{toCategoryInitials(data.category)} 에디터</span>
          <span aria-hidden="true" className="text-gray-400">·</span>
          <time dateTime={data.savedAt}>{formatPublishedDate(data.savedAt)}</time>
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
