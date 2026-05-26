"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const DEFAULT_URL = "http://localhost:3002";

type AccountStat = { blogId: string; postedToday: number; remaining: number };
type StatsResp = { ok: true; cap: number; accounts: AccountStat[] };
type ActionMsg = { kind: "success" | "error" | "info"; text: string };

const baseUrl = (): string =>
  process.env.NEXT_PUBLIC_BLOG_STATS_API_URL?.trim() || DEFAULT_URL;

const fetchAccounts = async (): Promise<AccountStat[]> => {
  const res = await fetch(new URL("/api/blog-stats/today", baseUrl()), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`stats ${res.status}`);
  const data = (await res.json()) as StatsResp | { ok: false };
  if ("ok" in data && data.ok) return data.accounts;
  return [];
};

const callLogin = async (blogId: string): Promise<{ ok: boolean; reason?: string }> => {
  const res = await fetch(new URL("/api/login-naver", baseUrl()), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blogId }),
  });
  try {
    return (await res.json()) as { ok: boolean; reason?: string };
  } catch {
    return { ok: false, reason: `HTTP ${res.status}` };
  }
};

const triggerPublish = async (
  blogId: string | null
): Promise<{ ok: boolean; reason?: string; pid?: number; blogId?: string }> => {
  const res = await fetch(new URL("/api/blog-publish/next", baseUrl()), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogId ? { blogId } : {}),
  });
  try {
    return (await res.json()) as { ok: boolean; reason?: string; pid?: number; blogId?: string };
  } catch {
    return { ok: false, reason: `HTTP ${res.status}` };
  }
};

export const AccountActionsCard = () => {
  const qc = useQueryClient();
  const [pendingLogin, setPendingLogin] = useState<string | null>(null);
  const [pendingPublish, setPendingPublish] = useState(false);
  const [msg, setMsg] = useState<ActionMsg | null>(null);
  const { data: accounts = [] } = useQuery({
    queryKey: ["admin", "blog-accounts-actions"],
    queryFn: fetchAccounts,
    refetchInterval: 5000,
    staleTime: 5000,
    retry: false,
  });

  const handleLogin = async (blogId: string) => {
    setPendingLogin(blogId);
    setMsg({ kind: "info", text: `${blogId} — 열린 Chromium에서 로그인하세요` });
    try {
      const r = await callLogin(blogId);
      if (r.ok) setMsg({ kind: "success", text: `${blogId} 세션 갱신 ✓` });
      else setMsg({ kind: "error", text: `${blogId} 로그인 실패: ${r.reason ?? "unknown"}` });
    } catch (e) {
      setMsg({ kind: "error", text: `로그인 호출 오류: ${e instanceof Error ? e.message : String(e)}` });
    } finally {
      setPendingLogin(null);
      qc.invalidateQueries({ queryKey: ["admin", "blog-stats-today"] });
    }
  };

  const handlePublishNext = async () => {
    setPendingPublish(true);
    setMsg({ kind: "info", text: "발행 트리거 중 (자동 계정 픽)…" });
    try {
      const r = await triggerPublish(null);
      if (r.ok) {
        setMsg({
          kind: "success",
          text: `${r.blogId} 발행 시작 (pid=${r.pid}). 약 5분 걸림. 큐 dashboard에서 확인.`,
        });
        qc.invalidateQueries({ queryKey: ["admin", "blog-queue-snapshot"] });
        qc.invalidateQueries({ queryKey: ["admin", "blog-stats-today"] });
      } else {
        setMsg({ kind: "error", text: `발행 트리거 실패: ${r.reason ?? "unknown"}` });
      }
    } catch (e) {
      setMsg({ kind: "error", text: `트리거 호출 오류: ${e instanceof Error ? e.message : String(e)}` });
    } finally {
      setPendingPublish(false);
    }
  };

  const msgClass =
    msg?.kind === "success"
      ? "bg-emerald-50 text-emerald-700"
      : msg?.kind === "error"
        ? "bg-red-50 text-red-700"
        : "bg-blue-50 text-blue-700";

  const allMaxed = accounts.length > 0 && accounts.every((a) => a.remaining === 0);

  return (
    <section className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">계정 액션</h3>
        <button
          type="button"
          onClick={handlePublishNext}
          disabled={pendingPublish || allMaxed || accounts.length === 0}
          className="h-9 cursor-pointer rounded-xl bg-gray-900 px-4 text-xs font-bold text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {pendingPublish ? "트리거 중…" : "다음 패키지 발행"}
        </button>
      </header>
      {accounts.length === 0 ? (
        <p className="text-xs text-gray-500">
          recipioReview /api/blog-stats/today 응답 없음 — `npm run dev` (port 3002) 떠 있는지 확인.
        </p>
      ) : (
        <ul className="space-y-1">
          {accounts.map((a) => (
            <li
              key={a.blogId}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs"
            >
              <span className="font-medium text-gray-900">{a.blogId}</span>
              <button
                type="button"
                onClick={() => handleLogin(a.blogId)}
                disabled={pendingLogin === a.blogId}
                className="h-7 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-[11px] hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                {pendingLogin === a.blogId ? "대기 중…" : "🔑 로그인"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {msg && (
        <p className={`rounded-lg px-3 py-2 text-[11px] ${msgClass}`}>{msg.text}</p>
      )}
    </section>
  );
};
