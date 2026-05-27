"use client";

import { useQuery } from "@tanstack/react-query";

const DEFAULT_URL = "http://localhost:3002";
const POLL_MS = 30_000;

export type LoginStatus = {
  exists: boolean;
  mtimeMs: number | null;
  ageHours: number | null;
};

export type AccountStat = {
  blogId: string;
  postedToday: number;
  remaining: number;
  loginStatus: LoginStatus;
};

type StatsResponseOk = { ok: true; cap: number; accounts: AccountStat[] };
type StatsResponseErr = { ok: false; reason?: string };

export type BlogStatsData = {
  cap: number;
  accounts: AccountStat[];
};

export const blogStatsBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_BLOG_STATS_API_URL?.trim() || DEFAULT_URL;

const fetchStats = async (): Promise<BlogStatsData> => {
  const url = new URL("/api/blog-stats/today", blogStatsBaseUrl());
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    let reason = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as StatsResponseErr;
      if (body?.reason) reason = body.reason;
    } catch {
      // ignore body parse failure
    }
    throw new Error(reason);
  }
  const data = (await res.json()) as StatsResponseOk | StatsResponseErr;
  if ("ok" in data && data.ok) return { cap: data.cap, accounts: data.accounts };
  throw new Error(("reason" in data && data.reason) || "응답 형식 오류");
};

// 두 dashboard 카드가 같은 query key를 공유 — tanstack-query가 자동 dedup.
// 30s 폴링 (5s는 spam). 수동 refresh는 queryClient.invalidateQueries로.
export const useBlogStats = () =>
  useQuery({
    queryKey: ["admin", "blog-stats-today"] as const,
    queryFn: fetchStats,
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
    retry: false,
  });

export const BLOG_STATS_QUERY_KEY = ["admin", "blog-stats-today"] as const;
