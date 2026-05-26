"use client";

import { useQuery } from "@tanstack/react-query";

import { getQueueSnapshot } from "@/app/actions/getQueueSnapshot";

const POLL_MS = 5_000;

export const QueueStatusCard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "blog-queue-snapshot"],
    queryFn: () => getQueueSnapshot(),
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
  });

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

  const preview = data.pending.slice(0, 5);
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
      {preview.length > 0 && (
        <ul className="space-y-1 border-t border-gray-100 pt-2">
          {preview.map((item) => (
            <li key={item.name} className="text-[11px] text-gray-600">
              <span className="mr-2 rounded bg-gray-100 px-1 py-0.5 text-[10px] text-gray-700">
                {item.prefix}
              </span>
              <span className="truncate">{item.name}</span>
            </li>
          ))}
          {data.pendingCount > preview.length && (
            <li className="text-[11px] text-gray-400">
              +{data.pendingCount - preview.length} 개 더…
            </li>
          )}
        </ul>
      )}
    </section>
  );
};
