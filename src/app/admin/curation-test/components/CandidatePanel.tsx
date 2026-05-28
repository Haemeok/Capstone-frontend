"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { CurationParams } from "@/entities/curation";

import {
  type AllowlistEntryWithSlug,
  getUnpublishedAllowlistEntries,
} from "@/app/actions/curation.allowlistFilter";

import { useDeadSlugStore } from "../lib/deadSlugStore";
import { CURATION_UNPUBLISHED_KEY } from "../lib/queryKeys";
import { useCurationStore } from "../lib/store";
import {
  runBatchGenerate,
  runBatchPublish,
} from "../model/batchPublishHandler";
import {
  type BatchItemState,
  useBatchPublishStore,
} from "../model/batchPublishStore";

type AllowlistEntry = CurationParams;

const ALLOWLIST_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/seo/allowlist.json";

const PAGE_SIZE = 200;

const QUERY_KEY = CURATION_UNPUBLISHED_KEY;

const fetchAllowlist = async (): Promise<AllowlistEntry[]> => {
  const res = await fetch(ALLOWLIST_URL);
  if (!res.ok) throw new Error(`allowlist fetch ${res.status}`);
  const j = await res.json();
  return (j.pages ?? []) as AllowlistEntry[];
};

const STATUS_LABEL: Record<BatchItemState["status"], string> = {
  idle: "",
  generating: "생성 중",
  generated: "생성됨",
  publishing: "발행 중",
  done: "완료",
  error: "실패",
};

const STATUS_CLASS: Record<BatchItemState["status"], string> = {
  idle: "",
  generating: "text-blue-600",
  generated: "text-amber-700",
  publishing: "text-blue-700",
  done: "text-green-700",
  error: "text-red-600",
};

const ACTIVE_STATUSES = new Set<BatchItemState["status"]>([
  "generating",
  "generated",
  "publishing",
  "error",
]);

export const CandidatePanel = () => {
  const setSelected = useCurationStore((s) => s.setSelected);
  const selectedSlug = useCurationStore((s) => s.selectedSlug);
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [visiblePages, setVisiblePages] = useState(1);
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLLIElement | null>(null);

  const items = useBatchPublishStore((s) => s.items);
  const deadSlugs = useDeadSlugStore((s) => s.slugs);
  const addDeadSlug = useDeadSlugStore((s) => s.add);

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const entries = await fetchAllowlist();
      return await getUnpublishedAllowlistEntries(entries);
    },
    staleTime: 60_000,
  });

  // dead-slug (INSUFFICIENT_RECIPES 로 hide 처리된 항목) 는 모든 그룹에서 사라져야 함.
  const data = useMemo<AllowlistEntryWithSlug[] | undefined>(
    () => rawData?.filter((d) => !deadSlugs.has(d.slug)),
    [rawData, deadSlugs],
  );

  const pinned = useMemo<AllowlistEntryWithSlug | null>(
    () => data?.find((d) => d.slug === selectedSlug) ?? null,
    [data, selectedSlug],
  );

  // active 그룹: data 인덱스 순 안정 정렬, 필터 무관 (사용자가 의식적으로 굴리는 셋이라 항상 보여야 함).
  const activeRows = useMemo<AllowlistEntryWithSlug[]>(() => {
    if (!data) return [];
    return data.filter((e) => {
      if (selectedKeys.has(e.slug)) return true;
      const status = items[e.slug]?.status;
      return status !== undefined && ACTIVE_STATUSES.has(status);
    });
  }, [data, items, selectedKeys]);

  const activeSlugSet = useMemo(
    () => new Set(activeRows.map((r) => r.slug)),
    [activeRows],
  );

  // 후보(=비-active) 풀 — 필터 + pinned 분리 후 페이지 컷
  const candidatePool = useMemo<AllowlistEntryWithSlug[]>(() => {
    if (!data) return [];
    const q = deferredFilter.toLowerCase();
    const out: AllowlistEntryWithSlug[] = [];
    for (const e of data) {
      if (activeSlugSet.has(e.slug)) continue;
      if (pinned && e.slug === pinned.slug) continue;
      if (deferredFilter && !JSON.stringify(e.entry).toLowerCase().includes(q))
        continue;
      out.push(e);
    }
    return out;
  }, [data, deferredFilter, activeSlugSet, pinned]);

  const visibleLimit = visiblePages * PAGE_SIZE;
  const candidateRows = useMemo(
    () => candidatePool.slice(0, visibleLimit),
    [candidatePool, visibleLimit],
  );
  const hasMore = candidateRows.length < candidatePool.length;

  // pinned 가 active 에 포함되면 별도 슬롯 노출 안 함
  const pinnedSeparate = pinned && !activeSlugSet.has(pinned.slug) ? pinned : null;

  useEffect(() => {
    setVisiblePages(1);
  }, [deferredFilter, selectedSlug]);

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisiblePages((p) => p + 1);
        }
      },
      { root: scrollRef.current, rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, candidateRows.length]);

  const selectedTargets = useMemo(
    () => (data ?? []).filter((d) => selectedKeys.has(d.slug)),
    [data, selectedKeys],
  );

  const generatableCount = useMemo(
    () =>
      selectedTargets.filter((t) => {
        const status = items[t.slug]?.status;
        return status !== "generating" && status !== "publishing";
      }).length,
    [selectedTargets, items],
  );

  const publishableCount = useMemo(
    () =>
      selectedTargets.filter((t) => items[t.slug]?.status === "generated").length,
    [selectedTargets, items],
  );

  const busy = generating || publishing;

  const toggleKey = (slug: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      const visible = [
        ...activeRows,
        ...(pinnedSeparate ? [pinnedSeparate] : []),
        ...candidateRows,
      ];
      const allChecked =
        visible.length > 0 && visible.every((f) => next.has(f.slug));
      if (allChecked) {
        for (const f of visible) next.delete(f.slug);
      } else {
        for (const f of visible) next.add(f.slug);
      }
      return next;
    });
  };

  const onBatchGenerate = async () => {
    if (busy) return;
    const targets = selectedTargets.filter((t) => {
      const status = items[t.slug]?.status;
      return status !== "generating" && status !== "publishing";
    });
    if (targets.length === 0) return;
    setGenerating(true);
    try {
      await runBatchGenerate(
        targets.map((t) => ({ key: t.slug, params: t.entry })),
        {
          onDeadSlug: (key) => {
            addDeadSlug(key);
            setSelectedKeys((prev) => {
              if (!prev.has(key)) return prev;
              const next = new Set(prev);
              next.delete(key);
              return next;
            });
          },
        },
      );
    } finally {
      setGenerating(false);
    }
  };

  const onBatchPublish = async () => {
    if (busy) return;
    const snapshot = useBatchPublishStore.getState().items;
    const targets = selectedTargets.flatMap((t) => {
      const item = snapshot[t.slug];
      if (item?.status !== "generated" || !item.result) return [];
      return [{ key: t.slug, result: item.result }];
    });
    if (targets.length === 0) return;
    setPublishing(true);
    try {
      await runBatchPublish(targets, {
        onItemDone: (key) => {
          // optimistic 즉시 제거 — refetch 기다리지 않고 리스트에서 사라짐.
          queryClient.setQueryData<AllowlistEntryWithSlug[]>(
            QUERY_KEY,
            (old) => old?.filter((d) => d.slug !== key),
          );
        },
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        for (const t of targets) next.delete(t.key);
        return next;
      });
    } finally {
      setPublishing(false);
    }
  };

  const renderRow = (
    f: AllowlistEntryWithSlug,
    opts: { highlightPinned?: boolean; pinnedBadge?: boolean } = {},
  ) => {
    const state = items[f.slug];
    const status = state?.status ?? "idle";
    const checked = selectedKeys.has(f.slug);
    const checkboxLocked =
      busy && (status === "generating" || status === "publishing");
    const warningCount = state?.result?.warnings?.length ?? 0;
    return (
      <li key={f.slug} className="flex items-stretch gap-1">
        <label
          className={`flex items-start pl-1 pr-2 pt-1.5 rounded-l ${
            checkboxLocked ? "" : "cursor-pointer hover:bg-gray-100"
          }`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleKey(f.slug)}
            disabled={checkboxLocked}
            className="w-5 h-5"
          />
        </label>
        <button
          type="button"
          className={`flex-1 text-left text-sm hover:bg-gray-100 rounded px-2 py-1 ${
            opts.highlightPinned ? "bg-amber-50 font-medium" : ""
          }`}
          onClick={() =>
            opts.highlightPinned && !opts.pinnedBadge
              ? setSelected(null)
              : setSelected(f.entry, f.slug)
          }
        >
          <div className="flex items-center gap-2">
            <span className="flex-1 break-all">{JSON.stringify(f.entry)}</span>
            {opts.pinnedBadge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                워크스페이스
              </span>
            )}
          </div>
          {(status !== "idle" || warningCount > 0) && (
            <div className={`text-xs mt-0.5 flex items-center gap-2 ${STATUS_CLASS[status]}`}>
              {status !== "idle" && (
                <span>
                  {STATUS_LABEL[status]}
                  {state?.error ? ` — ${state.error}` : ""}
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-amber-700">⚠ 검토필요({warningCount})</span>
              )}
            </div>
          )}
        </button>
      </li>
    );
  };

  return (
    <aside ref={scrollRef} className="border-r overflow-y-auto p-3 space-y-2">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={`필터 (총 ${data?.length ?? 0}건 — 미발행만)`}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={toggleAllVisible}
          disabled={
            activeRows.length + candidateRows.length === 0 && !pinnedSeparate
          }
          className="rounded border px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
        >
          {(() => {
            const visible = [
              ...activeRows,
              ...(pinnedSeparate ? [pinnedSeparate] : []),
              ...candidateRows,
            ];
            return visible.length > 0 &&
              visible.every((f) => selectedKeys.has(f.slug))
              ? "표시 항목 해제"
              : "표시 항목 모두 선택";
          })()}
        </button>
        <button
          type="button"
          onClick={onBatchGenerate}
          disabled={busy || generatableCount === 0}
          className="rounded bg-amber-600 text-white px-3 py-1 disabled:opacity-50"
        >
          {generating
            ? "생성 중..."
            : `선택 ${selectedTargets.length}개 생성 (가능 ${generatableCount})`}
        </button>
        <button
          type="button"
          onClick={onBatchPublish}
          disabled={busy || publishableCount === 0}
          className="rounded bg-black text-white px-3 py-1 disabled:opacity-50"
        >
          {publishing
            ? "발행 중..."
            : `선택 ${selectedTargets.length}개 발행 (가능 ${publishableCount})`}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        {isLoading
          ? "로드 중..."
          : error
            ? "allowlist 로드 실패"
            : `작업 중 ${activeRows.length} · 후보 ${candidateRows.length}/${candidatePool.length}건 표시`}
      </p>

      {activeRows.length > 0 && (
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wide text-amber-700">
            작업 중 ({activeRows.length})
          </div>
          <ul className="space-y-1">
            {activeRows.map((row) => {
              const isPinned = pinned?.slug === row.slug;
              return renderRow(row, {
                highlightPinned: isPinned,
                pinnedBadge: isPinned,
              });
            })}
          </ul>
          <hr className="my-2 border-gray-200" />
        </div>
      )}

      {pinnedSeparate && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-amber-700">
            <span>워크스페이스</span>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-gray-800"
            >
              해제
            </button>
          </div>
          <ul>{renderRow(pinnedSeparate, { highlightPinned: true })}</ul>
          <hr className="my-2 border-gray-200" />
        </div>
      )}

      <div className="space-y-1">
        {(activeRows.length > 0 || pinnedSeparate) && (
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            후보
          </div>
        )}
        <ul className="space-y-1">
          {candidateRows.map((f) => renderRow(f))}
          {hasMore && (
            <li
              ref={sentinelRef}
              className="py-3 text-center text-xs text-gray-400"
            >
              더 불러오는 중...
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};
