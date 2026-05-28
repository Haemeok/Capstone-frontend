"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteQueueItem } from "@/app/actions/deleteQueueItem";
import { getQueueSnapshot } from "@/app/actions/getQueueSnapshot";

import { BLOG_QUEUE_SNAPSHOT_QUERY_KEY } from "../lib/usePendingCurationSlugs";

const POLL_MS = 5_000;
const PREVIEW_N = 5;

export const QueueStatusCard = () => {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: BLOG_QUEUE_SNAPSHOT_QUERY_KEY,
    queryFn: () => getQueueSnapshot(),
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
  });

  const deleteMut = useMutation({
    mutationFn: (name: string) => deleteQueueItem({ name }),
    onMutate: (name) => {
      setPendingDelete(name);
      setDeleteError(null);
    },
    onSettled: (res, _err, _name) => {
      setPendingDelete(null);
      if (res && !res.ok) {
        setDeleteError(res.reason ?? "삭제 실패");
      } else {
        qc.invalidateQueries({ queryKey: BLOG_QUEUE_SNAPSHOT_QUERY_KEY });
      }
    },
    onError: (err) => {
      setPendingDelete(null);
      setDeleteError(err instanceof Error ? err.message : "삭제 실패");
    },
  });

  const onDeleteClick = (name: string) => {
    if (!window.confirm(`pending 에서 삭제할까요?\n${name}\n→ trashed/ 로 이동 (복구 가능)`)) {
      return;
    }
    deleteMut.mutate(name);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-xs text-gray-500">
        큐 상태 조회 중…
      </div>
    );
  }

  if (isError || !data) {
    const msg = error instanceof Error ? error.message : "조회 실패";
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-xs text-red-600">
        큐 상태 조회 실패: {msg}
      </div>
    );
  }

  const visible = expanded ? data.pending : data.pending.slice(0, PREVIEW_N);
  const hiddenCount = data.pendingCount - visible.length;
  return (
    <section className="space-y-2 rounded-2xl border border-gray-100 bg-white p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">발행 큐</h3>
        <span className="text-[10px] text-gray-400">{data.queueDir}</span>
      </header>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">
          pending {data.pendingCount}
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800">
          posted {data.postedCount}
        </span>
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">
          failed {data.failedCount}
        </span>
      </div>
      {deleteError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">
          삭제 실패: {deleteError}
        </p>
      )}
      {visible.length > 0 && (
        <ul className="space-y-1 border-t border-gray-100 pt-2">
          {visible.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-2 text-[11px] text-gray-600"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 rounded bg-gray-100 px-1 py-0.5 text-[10px] text-gray-700">
                  {item.prefix}
                </span>
                <span className="truncate" title={item.name}>
                  {item.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDeleteClick(item.name)}
                disabled={pendingDelete === item.name}
                className="shrink-0 cursor-pointer rounded px-2 py-0.5 text-[10px] text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                title="pending 에서 trashed/ 로 이동 (복구 가능)"
              >
                {pendingDelete === item.name ? "삭제 중…" : "🗑"}
              </button>
            </li>
          ))}
          {hiddenCount > 0 && !expanded && (
            <li>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="cursor-pointer text-[11px] text-gray-500 hover:text-gray-700"
              >
                +{hiddenCount} 개 더 보기
              </button>
            </li>
          )}
          {expanded && data.pendingCount > PREVIEW_N && (
            <li>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="cursor-pointer text-[11px] text-gray-500 hover:text-gray-700"
              >
                접기
              </button>
            </li>
          )}
        </ul>
      )}
    </section>
  );
};
