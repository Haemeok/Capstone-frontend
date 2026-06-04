"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { hydrateCurationBlogMarkdown } from "../lib/curationBlogBody";
import type { CurationBlogPost } from "../lib/curationBlogPost.schema";

const ChatMarkdown = dynamic(
  () => import("@/features/recipe-chat/ui/ChatMarkdown"),
  { ssr: false }
);

type Props = {
  post: CurationBlogPost;
  imageUrlsBySlot: Record<string, string>;
  recipes: StaticRecipe[];
};

export const CurationBlogPreview = ({
  post,
  imageUrlsBySlot,
  recipes,
}: Props) => {
  const coverUrl = imageUrlsBySlot.cover;
  const hydrated = useMemo(
    () => hydrateCurationBlogMarkdown(post.bodyMarkdown, recipes, post.alts),
    [post.bodyMarkdown, post.alts, recipes]
  );

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

      <section className="prose prose-sm max-w-none">
        <ChatMarkdown text={hydrated} />
      </section>

      <p className="text-xs text-gray-500">
        ⤳{" "}
        <a href={post.curationUrl} className="underline">
          {post.curationUrl}
        </a>
      </p>

      <ul className="flex flex-wrap gap-2 text-xs text-gray-600">
        {post.hashtags.map((h) => (
          <li key={h} className="rounded bg-gray-100 px-2 py-1">
            {h}
          </li>
        ))}
      </ul>
    </article>
  );
};
