"use client";

import type { CurationBlogPost } from "../lib/curationBlogPost.schema";

type Props = {
  post: CurationBlogPost;
  imageUrlsBySlot: Record<string, string>;
};

export const CurationBlogPreview = ({ post, imageUrlsBySlot }: Props) => {
  const coverUrl = imageUrlsBySlot.cover;

  return (
    <article className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6">
      {coverUrl && (
        <figure className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={post.alts.cover ?? post.title.main}
            className="w-full rounded-xl object-cover"
          />
          <figcaption className="text-center text-xs text-gray-500">
            {post.captionForCover}
          </figcaption>
        </figure>
      )}

      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">{post.title.main}</h1>
        <p className="text-sm text-gray-500">{post.title.sub}</p>
      </header>

      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
        {post.lead}
      </p>

      <section className="space-y-6">
        {post.sections.map((s) => {
          const url = imageUrlsBySlot[s.imageSlot];
          return (
            <div key={s.recipeId} className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">{s.recipeTitle}</h2>
              {url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={url}
                  alt={post.alts[s.imageSlot] ?? s.recipeTitle}
                  className="w-full rounded-xl object-cover"
                />
              )}
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
                {s.blurb}
              </p>
              <a
                href={s.recipeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs text-olive-light underline"
              >
                레시피 자세히 보기 →
              </a>
            </div>
          );
        })}
      </section>

      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
        {post.closingNote}
      </p>

      <p className="text-xs text-gray-500">
        ⤳ <a href={post.curationUrl} className="underline">{post.curationUrl}</a>
      </p>

      <ul className="flex flex-wrap gap-2 text-xs text-gray-600">
        {post.hashtags.map((h) => (
          <li key={h} className="rounded bg-gray-100 px-2 py-1">{h}</li>
        ))}
      </ul>
    </article>
  );
};
