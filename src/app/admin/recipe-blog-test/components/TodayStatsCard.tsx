"use client";

import { useQueryClient } from "@tanstack/react-query";

import { BLOG_STATS_QUERY_KEY, useBlogStats } from "../lib/useBlogStats";

export const TodayStatsCard = () => {
  const qc = useQueryClient();
  const { data, isLoading, isError, error, isFetching } = useBlogStats();

  const handleRefresh = () => qc.invalidateQueries({ queryKey: BLOG_STATS_QUERY_KEY });

  return (
    <section className="space-y-2 rounded-2xl border border-gray-100 bg-white p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">오늘 발행 / 남은 quota</h3>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching}
          className="cursor-pointer text-[10px] text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
        >
          {isFetching ? "갱신 중…" : "↻"}
        </button>
      </header>

      {isLoading && <p className="text-xs text-gray-500">조회 중…</p>}

      {isError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          recipioReview 응답 실패: {error instanceof Error ? error.message : "unknown"}
          <br />
          <span className="text-[10px] text-red-500">
            `cd recipioReview && npm run dev` (port 3002) 떠 있는지 확인.
          </span>
        </p>
      )}

      {data && data.accounts.length === 0 && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          recipioReview 응답 OK인데 등록 계정 0개 — `.env`에 `NAVER_BLOG_IDS=acc1,acc2` 설정 후 재시작.
        </p>
      )}

      {data && data.accounts.length > 0 && (
        <ul className="space-y-1">
          {data.accounts.map((acc) => {
            const exhausted = acc.remaining === 0;
            return (
              <li
                key={acc.blogId}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
                  exhausted ? "bg-gray-100 text-gray-500" : "bg-emerald-50 text-emerald-800"
                }`}
              >
                <span className="font-medium">{acc.blogId}</span>
                <span>
                  {acc.postedToday}/{data.cap} 사용 · 남은 {acc.remaining}개
                  {exhausted && <span className="ml-2 text-gray-400">마감</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
