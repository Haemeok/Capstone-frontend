"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { CurationParams } from "@/entities/curation";

import {
  type AllowlistEntryWithSlug,
  getUnpublishedAllowlistEntries,
} from "@/app/actions/curation.allowlistFilter";

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

const QUERY_KEY = ["curation-unpublished"] as const;

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

  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const entries = await fetchAllowlist();
      return await getUnpublishedAllowlistEntries(entries);
    },
    staleTime: 60_000,
  });

  const pinned = useMemo<AllowlistEntryWithSlug | null>(
    () => data?.find((d) => d.slug === selectedSlug) ?? null,
    [data, selectedSlug],
  );

  const matched = useMemo<AllowlistEntryWithSlug[]>(() => {
    if (!data) return [];
    const q = deferredFilter.toLowerCase();
    const out: AllowlistEntryWithSlug[] = [];
    for (const e of data) {
      if (e.slug === selectedSlug) continue;
      if (deferredFilter && !JSON.stringify(e.entry).toLowerCase().includes(q))
        continue;
      out.push(e);
    }
    return out;
  }, [data, deferredFilter, selectedSlug]);

  const visibleLimit = visiblePages * PAGE_SIZE;
  const filtered = useMemo(
    () => matched.slice(0, visibleLimit),
    [matched, visibleLimit],
  );
  const hasMore = filtered.length < matched.length;

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
  }, [hasMore, filtered.length]);

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

  const visibleSelected = useMemo(() => {
    let count = filtered.reduce(
      (acc, f) => (selectedKeys.has(f.slug) ? acc + 1 : acc),
      0,
    );
    if (pinned && selectedKeys.has(pinned.slug)) count += 1;
    return count;
  }, [filtered, selectedKeys, pinned]);

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
      const visible = pinned ? [pinned, ...filtered] : filtered;
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
        onItemDone: () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
      });
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        for (const t of targets) next.delete(t.key);
        return next;
      });
    } finally {
      setPublishing(false);
    }
  };

  const renderRow = (f: AllowlistEntryWithSlug, isPinned = false) => {
    const state = items[f.slug];
    const status = state?.status ?? "idle";
    const checked = selectedKeys.has(f.slug);
    const checkboxLocked =
      busy && (status === "generating" || status === "publishing");
    return (
      <li
        key={f.slug}
        className={`flex items-start gap-2 ${
          isPinned ? "bg-amber-50 rounded px-1 py-1" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleKey(f.slug)}
          disabled={checkboxLocked}
          className="mt-1.5"
        />
        <button
          type="button"
          className={`flex-1 text-left text-sm hover:bg-gray-100 rounded px-2 py-1 ${
            isPinned ? "font-medium" : ""
          }`}
          onClick={() => (isPinned ? setSelected(null) : setSelected(f.entry, f.slug))}
        >
          <div>{JSON.stringify(f.entry)}</div>
          {status !== "idle" && (
            <div className={`text-xs mt-0.5 ${STATUS_CLASS[status]}`}>
              {STATUS_LABEL[status]}
              {state?.error ? ` — ${state.error}` : ""}
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
          disabled={filtered.length === 0 && !pinned}
          className="rounded border px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
        >
          {(() => {
            const visible = pinned ? [pinned, ...filtered] : filtered;
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
          {generating ? "생성 중..." : `선택 ${generatableCount}개 생성`}
        </button>
        <button
          type="button"
          onClick={onBatchPublish}
          disabled={busy || publishableCount === 0}
          className="rounded bg-black text-white px-3 py-1 disabled:opacity-50"
        >
          {publishing ? "발행 중..." : `생성된 ${publishableCount}개 발행`}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        {isLoading
          ? "로드 중..."
          : error
            ? "allowlist 로드 실패"
            : deferredFilter
              ? `매칭 ${matched.length}건 중 ${filtered.length}건 표시 (선택 ${visibleSelected}개)`
              : `${filtered.length}/${matched.length}건 표시 (선택 ${visibleSelected}개) — 스크롤로 더 불러오기`}
      </p>

      {pinned && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-amber-700">
            <span>선택된 조건 (Workspace)</span>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-gray-800"
            >
              해제
            </button>
          </div>
          <ul>{renderRow(pinned, true)}</ul>
          <hr className="my-2 border-gray-200" />
        </div>
      )}

      <ul className="space-y-1">
        {filtered.map((f) => renderRow(f))}
        {hasMore && (
          <li ref={sentinelRef} className="py-3 text-center text-xs text-gray-400">
            더 불러오는 중...
          </li>
        )}
      </ul>
    </aside>
  );
};
