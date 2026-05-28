"use client";

import { useCallback, useMemo, useState } from "react";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";

import { fetchCurationArticleList } from "@/features/curation/model/api.server";

import { prunePending } from "../lib/prunePending";
import type { BlogTone } from "../lib/toneInserts";
import { useBatchRewrite } from "../lib/useBatchRewrite";
import {
  BLOG_QUEUE_SNAPSHOT_QUERY_KEY,
  usePendingCurationSlugs,
} from "../lib/usePendingCurationSlugs";
import { BatchItemCard } from "./BatchItemCard";
import { BatchToneSelector } from "./BatchToneSelector";
import { CurationArticleSearchPanel } from "./CurationArticleSearchPanel";

const PHASE_BADGE = {
  ready: "리라이트 ✓",
  enqueued: "큐 담김 ✓",
  failed: "실패",
} as const;

export const CurationBlogMode = () => {
  const [tone, setTone] = useState<BlogTone>("epigung");
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(() => new Set());
  const { items, isRunning, isEnqueueing, runRewrite, enqueueAllReady, reset } =
    useBatchRewrite();
  const queryClient = useQueryClient();
  const { slugs: pendingSlugs } = usePendingCurationSlugs();

  const titlesQuery = useInfiniteQuery({
    queryKey: ["admin", "curation-titles-prefetch"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchCurationArticleList({ page: pageParam, size: 50 }),
    getNextPageParam: () => undefined,
    staleTime: 60_000,
  });

  const titlesBySlug = useMemo(() => {
    const map: Record<string, string> = {};
    const rows = titlesQuery.data?.pages.flatMap((p) => p.content) ?? [];
    for (const r of rows) map[r.slug] = r.title;
    return map;
  }, [titlesQuery.data]);

  const effectiveSelected = useMemo(
    () => prunePending(selectedSlugs, pendingSlugs),
    [selectedSlugs, pendingSlugs],
  );

  const handleToggle = useCallback((slug: string, next: boolean) => {
    setSelectedSlugs((prev) => {
      const out = new Set(prev);
      if (next) out.add(slug);
      else out.delete(slug);
      return out;
    });
  }, []);

  const slugBadge = useCallback(
    (slug: string): string | null => {
      const item = items.find((it) => it.slug === slug);
      if (!item) return null;
      if (item.phase === "enqueued") return PHASE_BADGE.enqueued;
      if (item.phase === "ready") return PHASE_BADGE.ready;
      if (item.phase === "failed" || item.phase === "enqueue-failed") return PHASE_BADGE.failed;
      return null;
    },
    [items],
  );

  const handleStart = useCallback(() => {
    if (effectiveSelected.size === 0) return;
    triggerHaptic("Medium");
    void runRewrite([...effectiveSelected], tone, titlesBySlug);
  }, [effectiveSelected, tone, titlesBySlug, runRewrite]);

  const handleEnqueueAll = useCallback(async () => {
    triggerHaptic("Medium");
    await enqueueAllReady();
    queryClient.invalidateQueries({ queryKey: BLOG_QUEUE_SNAPSHOT_QUERY_KEY });
  }, [enqueueAllReady, queryClient]);

  const handleClear = useCallback(() => {
    reset();
    setSelectedSlugs(new Set());
  }, [reset]);

  const readyCount = items.filter((it) => it.phase === "ready").length;
  const enqueuedCount = items.filter((it) => it.phase === "enqueued").length;
  const failedCount = items.filter((it) => it.phase === "failed" || it.phase === "enqueue-failed").length;

  return (
    <div className="space-y-4">
      <BatchToneSelector value={tone} onChange={setTone} disabled={isRunning || isEnqueueing} />

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <CurationArticleSearchPanel
          mode="multi"
          selectedSlugs={effectiveSelected}
          onToggle={handleToggle}
          badges={slugBadge}
          excludeSlugs={pendingSlugs}
        />

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                선택 {effectiveSelected.size}개 · 완료 {items.length}개 (성공 {enqueuedCount + readyCount} · 실패 {failedCount})
              </p>
              <p className="mt-1 text-xs text-gray-500">
                톤 1개로 선택된 큐레이션 전부 리라이트 → "발행 큐 일괄 push".
              </p>
            </div>
            <button
              type="button"
              onClick={handleStart}
              disabled={isRunning || isEnqueueing || effectiveSelected.size === 0}
              className="h-11 cursor-pointer rounded-2xl bg-gray-900 px-5 text-sm font-bold text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isRunning ? "리라이트 중…" : "선택 리라이트"}
            </button>
            <button
              type="button"
              onClick={handleEnqueueAll}
              disabled={isRunning || isEnqueueing || readyCount === 0}
              className="h-11 cursor-pointer rounded-2xl border-2 border-gray-900 bg-white px-5 text-sm font-bold text-gray-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
            >
              {isEnqueueing ? "큐로 보내는 중…" : `발행 큐 일괄 push (${readyCount})`}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isRunning || isEnqueueing || items.length === 0}
              className="h-11 cursor-pointer rounded-2xl border border-gray-200 bg-white px-4 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              결과 비우기
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-400">
              좌측에서 큐레이션을 체크하고 톤을 골라 "선택 리라이트"
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.slug}>
                  <BatchItemCard item={it} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
