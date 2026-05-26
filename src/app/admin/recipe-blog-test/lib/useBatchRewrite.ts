"use client";

import { useCallback, useRef, useState } from "react";

import type { StaticRecipe } from "@/entities/recipe/model/types";
import { coverImageUrlFromKey } from "@/features/curation/lib/coverImageUrl";
import type { PublicCurationArticleDto } from "@/features/curation/model/api.server";

import { enqueueCurationBlogPostForPublish } from "@/app/actions/blogPublishQueue";
import {
  fetchCurationArticleWithRecipes,
  generateCurationBlogPost,
} from "@/app/actions/curationBlog";

import type { CurationBlogPost } from "./curationBlogPost.schema";
import type { BlogTone } from "./toneInserts";

export type BatchItemPhase =
  | "queued"
  | "fetching"
  | "generating"
  | "ready"
  | "enqueueing"
  | "enqueued"
  | "failed"
  | "enqueue-failed";

export type BatchItem = {
  slug: string;
  title: string;
  phase: BatchItemPhase;
  error?: string;
  tone?: BlogTone;
  ready?: {
    article: PublicCurationArticleDto;
    recipes: StaticRecipe[];
    post: CurationBlogPost;
    imageUrlsBySlot: Record<string, string>;
  };
  enqueued?: {
    packagePath: string;
    skippedSlots: string[];
  };
};

const buildImageUrlsBySlot = (
  coverUrl: string | null,
  recipes: StaticRecipe[],
): Record<string, string> => {
  const map: Record<string, string> = {};
  if (coverUrl) map.cover = coverUrl;
  for (const r of recipes) {
    if (r.imageUrl) map[`recipe-${r.id}`] = r.imageUrl;
  }
  return map;
};

export const useBatchRewrite = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnqueueing, setIsEnqueueing] = useState(false);
  const stoppedRef = useRef(false);

  const updateItem = useCallback((slug: string, patch: Partial<BatchItem>) => {
    setItems((prev) => prev.map((it) => (it.slug === slug ? { ...it, ...patch } : it)));
  }, []);

  const reset = useCallback(() => {
    setItems([]);
  }, []);

  const runRewrite = useCallback(
    async (slugs: string[], tone: BlogTone, titlesBySlug: Record<string, string>) => {
      if (isRunning) return;
      stoppedRef.current = false;
      setIsRunning(true);
      const initial: BatchItem[] = slugs.map((slug) => ({
        slug,
        title: titlesBySlug[slug] ?? slug,
        phase: "queued",
        tone,
      }));
      setItems(initial);

      try {
        for (const slug of slugs) {
          if (stoppedRef.current) break;
          updateItem(slug, { phase: "fetching" });
          const fetched = await fetchCurationArticleWithRecipes(slug);
          if (!fetched.success) {
            updateItem(slug, { phase: "failed", error: fetched.error });
            continue;
          }
          updateItem(slug, { phase: "generating" });
          const generated = await generateCurationBlogPost(
            fetched.article,
            fetched.recipes,
            tone,
          );
          if (!generated.success) {
            updateItem(slug, { phase: "failed", error: generated.error });
            continue;
          }
          const coverUrl = coverImageUrlFromKey(fetched.article.coverImageKey);
          updateItem(slug, {
            phase: "ready",
            ready: {
              article: fetched.article,
              recipes: fetched.recipes,
              post: generated.post,
              imageUrlsBySlot: buildImageUrlsBySlot(coverUrl, fetched.recipes),
            },
          });
        }
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning, updateItem],
  );

  const enqueueAllReady = useCallback(async () => {
    if (isEnqueueing) return;
    setIsEnqueueing(true);
    try {
      for (const it of items) {
        if (it.phase !== "ready" || !it.ready || !it.tone) continue;
        updateItem(it.slug, { phase: "enqueueing" });
        const res = await enqueueCurationBlogPostForPublish({
          post: it.ready.post,
          tone: it.tone,
          curationTitle: it.ready.article.title,
          imageUrlsBySlot: it.ready.imageUrlsBySlot,
          curationMeta: {
            slug: it.ready.article.slug,
            recipeIds: it.ready.article.recipeIds,
            brandLink: {
              text: "큐레이션 전체 보기",
              url: `https://recipio.kr/curation/${it.ready.article.slug}`,
            },
          },
          recipes: it.ready.recipes,
        });
        if (!res.success) {
          updateItem(it.slug, { phase: "enqueue-failed", error: res.error });
          continue;
        }
        updateItem(it.slug, {
          phase: "enqueued",
          enqueued: { packagePath: res.packagePath, skippedSlots: res.skippedSlots },
        });
      }
    } finally {
      setIsEnqueueing(false);
    }
  }, [isEnqueueing, items, updateItem]);

  const cancel = useCallback(() => {
    stoppedRef.current = true;
  }, []);

  return { items, isRunning, isEnqueueing, runRewrite, enqueueAllReady, reset, cancel };
};
