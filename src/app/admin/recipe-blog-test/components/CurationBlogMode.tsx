"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import { useQuery } from "@tanstack/react-query";

import { enqueueCurationBlogPostForPublish } from "@/app/actions/blogPublishQueue";
import {
  fetchCurationArticleWithRecipes,
  generateCurationBlogPost,
} from "@/app/actions/curationBlog";
import { coverImageUrlFromKey } from "@/features/curation/lib/coverImageUrl";
import type { StaticRecipe } from "@/entities/recipe/model/types";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { CurationBlogPost } from "../lib/curationBlogPost.schema";
import { CurationArticleSearchPanel } from "./CurationArticleSearchPanel";
import { CurationBlogPreview } from "./CurationBlogPreview";

const buildImageUrlsBySlot = (
  coverUrl: string | null,
  recipes: StaticRecipe[]
): Record<string, string> => {
  const map: Record<string, string> = {};
  if (coverUrl) map.cover = coverUrl;
  for (const r of recipes) {
    if (r.imageUrl) map[`recipe-${r.id}`] = r.imageUrl;
  }
  return map;
};

export const CurationBlogMode = () => {
  const [slug, setSlug] = useState<string | null>(null);
  const [post, setPost] = useState<CurationBlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [rewritePending, startRewriteTransition] = useTransition();
  const [enqueuePending, startEnqueueTransition] = useTransition();
  const [enqueueMessage, setEnqueueMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const articleQuery = useQuery({
    queryKey: ["admin", "curation-article-with-recipes", slug],
    queryFn: () => (slug ? fetchCurationArticleWithRecipes(slug) : null),
    enabled: !!slug,
    staleTime: 60_000,
  });

  useEffect(() => {
    setPost(null);
    setError(null);
    setEnqueueMessage(null);
  }, [slug]);

  const articleData =
    articleQuery.data?.success ? articleQuery.data : null;
  const articleError =
    articleQuery.data && !articleQuery.data.success ? articleQuery.data.error : null;

  const imageUrlsBySlot = useMemo(() => {
    if (!articleData) return {};
    const coverUrl = coverImageUrlFromKey(articleData.article.coverImageKey);
    return buildImageUrlsBySlot(coverUrl, articleData.recipes);
  }, [articleData]);

  const handleRewrite = useCallback(() => {
    if (!articleData) return;
    triggerHaptic("Medium");
    setError(null);
    startRewriteTransition(async () => {
      const res = await generateCurationBlogPost(
        articleData.article,
        articleData.recipes
      );
      if (!res.success) {
        setError(res.error);
        setPost(null);
        return;
      }
      setPost(res.post);
    });
  }, [articleData]);

  const handleEnqueue = useCallback(() => {
    if (!articleData || !post) return;
    triggerHaptic("Medium");
    setEnqueueMessage(null);

    startEnqueueTransition(async () => {
      const res = await enqueueCurationBlogPostForPublish({
        post,
        curationTitle: articleData.article.title,
        imageUrlsBySlot,
        curationMeta: {
          slug: articleData.article.slug,
          recipeIds: articleData.article.recipeIds,
          brandLink: {
            text: "큐레이션 전체 보기",
            url: `https://recipio.kr/curation/${articleData.article.slug}`,
          },
        },
      });
      if (!res.success) {
        setEnqueueMessage({ kind: "error", text: res.error });
        return;
      }
      const skippedNote =
        res.skippedSlots.length > 0
          ? ` (이미지 ${res.skippedSlots.length}장 누락: ${res.skippedSlots.join(", ")})`
          : "";
      setEnqueueMessage({
        kind: "success",
        text: `발행 큐에 담았어요. ${res.packagePath}${skippedNote}`,
      });
    });
  }, [articleData, post, imageUrlsBySlot]);

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <CurationArticleSearchPanel selectedSlug={slug} onSelect={setSlug} />

      <main className="space-y-4">
        {!slug && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-400">
            좌측에서 발행된 큐레이션을 선택하세요
          </div>
        )}

        {articleQuery.isLoading && (
          <p className="text-sm text-gray-500">큐레이션 + 레시피 조회 중…</p>
        )}

        {articleError && (
          <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-500">
            {articleError}
          </p>
        )}

        {articleData && (
          <>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500">선택된 큐레이션</p>
                <p className="text-sm font-semibold text-gray-900">
                  {articleData.article.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  레시피 {articleData.recipes.length}개
                  {articleData.missingRecipeIds.length > 0 && (
                    <span className="ml-2 text-amber-700">
                      ⚠ 누락 {articleData.missingRecipeIds.length}개
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRewrite}
                disabled={rewritePending || articleData.recipes.length < 3}
                className="h-12 cursor-pointer rounded-2xl bg-gray-900 px-6 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {rewritePending ? "리라이트 중…" : post ? "다시 리라이트" : "리라이트"}
              </button>
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-500">
                {error}
              </p>
            )}

            {post && (
              <>
                <CurationBlogPreview post={post} imageUrlsBySlot={imageUrlsBySlot} />

                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      네이버 블로그 발행 큐로 보내기
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      post.json + 이미지 + curation-meta.json 을 큐 폴더에 담아 둡니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleEnqueue}
                    disabled={enqueuePending}
                    className="h-12 cursor-pointer rounded-2xl border-2 border-gray-900 bg-white px-6 text-sm font-bold text-gray-900 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                  >
                    {enqueuePending ? "보내는 중…" : "발행 큐로 보내기"}
                  </button>
                </div>

                {enqueueMessage && (
                  <p
                    className={`rounded-2xl p-4 text-sm ${
                      enqueueMessage.kind === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {enqueueMessage.text}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};
