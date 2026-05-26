"use client";

import { useQuery } from "@tanstack/react-query";

const POLL_MS = 5_000;
const DEFAULT_URL = "http://localhost:3002";

type AccountStat = {
  blogId: string;
  postedToday: number;
  remaining: number;
};

type StatsResponse = {
  ok: true;
  cap: number;
  accounts: AccountStat[];
};

const fetchStats = async (): Promise<StatsResponse> => {
  // BLOG_STATS_API_URL은 build-time env (NEXT_PUBLIC_*). 미설정 시 localhost:3002
  // 기본값 (recipioReview의 `npm run dev` 가 3001 포트 사용).
  const base = process.env.NEXT_PUBLIC_BLOG_STATS_API_URL?.trim() || DEFAULT_URL;
  const res = await fetch(new URL("/api/blog-stats/today", base), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`stats API ${res.status}`);
  const data = (await res.json()) as StatsResponse | { ok: false; reason: string };
  if ("ok" in data && data.ok) return data;
  throw new Error("error" in data ? String((data as { reason: string }).reason) : "unknown");
};

export const TodayStatsCard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "blog-stats-today"],
    queryFn: fetchStats,
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-xs text-gray-500">
        오늘 발행 통계 조회 중…
      </div>
    );
  }

  if (isError || !data) {
    const msg = error instanceof Error ? error.message : "응답 없음";
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-xs text-red-600">
        recipioReview 통계 서버 응답 없음 ({msg}). `npm run dev` (port 3001) 떠 있는지 확인.
      </div>
    );
  }

  return (
    <section className="space-y-2 rounded-2xl border border-gray-100 bg-white p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">오늘 발행 / 남은 quota</h3>
        <span className="text-[10px] text-gray-400">cap {data.cap}/계정 · 5s polling</span>
      </header>
      {data.accounts.length === 0 ? (
        <p className="text-xs text-gray-500">등록된 네이버 계정이 없어요.</p>
      ) : (
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
