"use client";

import { useDeferredValue, useMemo, useState } from "react";

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

const VISIBLE_LIMIT = 200;

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
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const queryClient = useQueryClient();

  const items = useBatchPublishStore((s) => s.items);

  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const entries = await fetchAllowlist();
      return await getUnpublishedAllowlistEntries(entries);
    },
    staleTime: 60_000,
  });

  const filtered = useMemo<AllowlistEntryWithSlug[]>(() => {
    if (!data) return [];
    if (!deferredFilter) return data.slice(0, VISIBLE_LIMIT);
    const q = deferredFilter.toLowerCase();
    const out: AllowlistEntryWithSlug[] = [];
    for (const e of data) {
      if (JSON.stringify(e.entry).toLowerCase().includes(q)) {
        out.push(e);
        if (out.length >= VISIBLE_LIMIT) break;
      }
    }
    return out;
  }, [data, deferredFilter]);

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

  const visibleSelected = useMemo(
    () => filtered.filter((f) => selectedKeys.has(f.slug)).length,
    [filtered, selectedKeys],
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
      const allChecked = filtered.every((f) => next.has(f.slug));
      if (allChecked) {
        for (const f of filtered) next.delete(f.slug);
      } else {
        for (const f of filtered) next.add(f.slug);
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

  return (
    <aside className="border-r overflow-y-auto p-3 space-y-2">
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
          disabled={filtered.length === 0}
          className="rounded border px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
        >
          {filtered.every((f) => selectedKeys.has(f.slug)) &&
          filtered.length > 0
            ? "표시 항목 해제"
            : "표시 항목 모두 선택"}
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
              ? `매칭 ${filtered.length}건 표시 (최대 ${VISIBLE_LIMIT}건, 선택 ${visibleSelected}개)`
              : `상위 ${filtered.length}건 표시 / 미발행 전체 ${data?.length ?? 0}건. 필터로 좁혀 보세요`}
      </p>

      <ul className="space-y-1">
        {filtered.map((f) => {
          const state = items[f.slug];
          const status = state?.status ?? "idle";
          const checked = selectedKeys.has(f.slug);
          const checkboxLocked =
            busy && (status === "generating" || status === "publishing");
          return (
            <li key={f.slug} className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleKey(f.slug)}
                disabled={checkboxLocked}
                className="mt-1.5"
              />
              <button
                type="button"
                className="flex-1 text-left text-sm hover:bg-gray-100 rounded px-2 py-1"
                onClick={() => setSelected(f.entry, f.slug)}
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
        })}
      </ul>
    </aside>
  );
};
