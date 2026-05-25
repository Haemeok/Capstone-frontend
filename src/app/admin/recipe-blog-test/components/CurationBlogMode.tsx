"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import { useQuery } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { coverImageUrlFromKey } from "@/features/curation/lib/coverImageUrl";

import { enqueueCurationBlogPostForPublish } from "@/app/actions/blogPublishQueue";
import {
  fetchCurationArticleWithRecipes,
  generateCurationBlogPost,
} from "@/app/actions/curationBlog";

import type { CurationBlogPost } from "../lib/curationBlogPost.schema";
import type { BlogTone } from "../lib/toneInserts";
import { CurationArticleSearchPanel } from "./CurationArticleSearchPanel";
import { CurationBlogPreview } from "./CurationBlogPreview";

const TONE_OPTIONS: Array<{ tone: BlogTone; label: string }> = [
  { tone: "epigung", label: "에궁이궁" },
  { tone: "ellymom", label: "엘리맘" },
  { tone: "elarpi", label: "elarpi" },
  { tone: "minnie46", label: "여니쿡" },
  { tone: "haetsal", label: "햇살" },
];

const TONE_LABEL: Record<BlogTone, string> = TONE_OPTIONS.reduce(
  (acc, { tone, label }) => {
    acc[tone] = label;
    return acc;
  },
  {} as Record<BlogTone, string>,
);

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
  const [tone, setTone] = useState<BlogTone>("epigung");
  const [post, setPost] = useState<CurationBlogPost | null>(null);
  const [postTone, setPostTone] = useState<BlogTone | null>(null);
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
    setPostTone(null);
    setError(null);
    setEnqueueMessage(null);
  }, [slug]);

  const handleSelectTone = useCallback((next: BlogTone) => {
    triggerHaptic("Light");
    setTone(next);
    setPost(null);
    setPostTone(null);
    setError(null);
    setEnqueueMessage(null);
  }, []);

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
    const toneAtClick = tone;
    startRewriteTransition(async () => {
      const res = await generateCurationBlogPost(
        articleData.article,
        articleData.recipes,
        toneAtClick,
      );
      if (!res.success) {
        setError(res.error);
        setPost(null);
        setPostTone(null);
        return;
      }
      setPost(res.post);
      setPostTone(toneAtClick);
    });
  }, [articleData, tone]);

  const handleEnqueue = useCallback(() => {
    if (!articleData || !post || !postTone) return;
    triggerHaptic("Medium");
    setEnqueueMessage(null);

    startEnqueueTransition(async () => {
      const res = await enqueueCurationBlogPostForPublish({
        post,
        tone: postTone,
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
  }, [articleData, post, postTone, imageUrlsBySlot]);

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
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-3">
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
                  {rewritePending
                    ? "리라이트 중…"
                    : post
                      ? `${TONE_LABEL[tone]} 톤으로 다시 리라이트`
                      : `${TONE_LABEL[tone]} 톤으로 리라이트`}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500">블로거 톤</span>
                {TONE_OPTIONS.map((opt) => {
                  const active = opt.tone === tone;
                  return (
                    <button
                      key={opt.tone}
                      type="button"
                      onClick={() => handleSelectTone(opt.tone)}
                      disabled={rewritePending}
                      aria-pressed={active}
                      className={`h-8 cursor-pointer rounded-full px-3 text-xs font-medium transition disabled:cursor-not-allowed ${
                        active
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-500">
                {error}
              </p>
            )}

            {post && postTone && (
              <>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-2 text-xs text-gray-600">
                  <span>지금 보고 있는 톤</span>
                  <span className="rounded-full bg-gray-900 px-2 py-0.5 text-white">
                    {TONE_LABEL[postTone]}
                  </span>
                  {postTone !== tone && (
                    <span className="text-amber-700">
                      (선택은 “{TONE_LABEL[tone]}” — 리라이트하면 바뀝니다)
                    </span>
                  )}
                </div>

                <CurationBlogPreview
                  post={post}
                  imageUrlsBySlot={imageUrlsBySlot}
                  recipes={articleData.recipes}
                />

                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {TONE_LABEL[postTone]} 톤으로 발행 큐에 보내기
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      post.json + 이미지 + curation-meta.json 을 톤별 폴더에 담아 둡니다.
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
