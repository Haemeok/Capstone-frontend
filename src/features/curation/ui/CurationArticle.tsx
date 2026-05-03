import type { SavedCurationRecord } from "@/entities/curation";

import { CurationMarkdown } from "./CurationMarkdown";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

type CurationArticleProps = {
  data: SavedCurationRecord;
};

export const CurationArticle = ({ data }: CurationArticleProps) => {
  const dateLabel = formatDate(data.savedAt);

  return (
    <article className="mx-auto w-full max-w-[720px] px-5 pt-10 pb-20 md:px-6 md:pt-20">
      <header>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
          {data.h1}
        </h1>
        {data.dek && (
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            {data.dek}
          </p>
        )}
        <p className="mt-3 text-sm text-gray-500">
          에디터{dateLabel ? ` · ${dateLabel}` : ""}
        </p>
      </header>

      {data.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.thumbnailUrl}
          alt={data.h1}
          className="mt-8 aspect-[16/9] w-full rounded-lg object-cover"
        />
      )}

      <div className="mt-10">
        <CurationMarkdown markdown={data.markdown} />
      </div>
    </article>
  );
};
