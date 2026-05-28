"use client";

import { useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { BLOG_STATS_QUERY_KEY, blogStatsBaseUrl, useBlogStats } from "../lib/useBlogStats";

type ActionMsg = { kind: "success" | "error" | "info"; text: string };

const LOG_POLL_MS = 2000;
const LOG_POLL_MAX_MS = 10 * 60_000;

type TriggerResp = {
  ok: boolean;
  reason?: string;
  pid?: number;
  blogId?: string;
  logFile?: string;
  headless?: boolean;
};

const callLogin = async (blogId: string): Promise<{ ok: boolean; reason?: string }> => {
  const res = await fetch(new URL("/api/login-naver", blogStatsBaseUrl()), {
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

const triggerPublish = async (blogId: string | null): Promise<TriggerResp> => {
  const res = await fetch(new URL("/api/blog-publish/next", blogStatsBaseUrl()), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogId ? { blogId } : {}),
  });
  try {
    return (await res.json()) as TriggerResp;
  } catch {
    return { ok: false, reason: `HTTP ${res.status}` };
  }
};

const callVerify = async (
  blogId: string
): Promise<{ ok: boolean; reason?: string; finalUrl?: string }> => {
  const res = await fetch(new URL("/api/login-verify", blogStatsBaseUrl()), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blogId }),
  });
  try {
    return (await res.json()) as { ok: boolean; reason?: string; finalUrl?: string };
  } catch {
    return { ok: false, reason: `HTTP ${res.status}` };
  }
};

// auth file age 표시. 24h 미만 emerald, 7d 미만 amber, 그 이상 red, 없음 gray.
const ageBadge = (
  ageHours: number | null,
  exists: boolean
): { text: string; cls: string } => {
  if (!exists || ageHours == null) {
    return { text: "auth 없음", cls: "bg-gray-100 text-gray-500" };
  }
  const cls =
    ageHours <= 24
      ? "bg-emerald-100 text-emerald-700"
      : ageHours <= 24 * 7
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";
  const text =
    ageHours < 1
      ? "방금"
      : ageHours < 24
        ? `${Math.floor(ageHours)}h 전`
        : `${Math.floor(ageHours / 24)}d 전`;
  return { text, cls };
};

const fetchLogTail = async (file: string): Promise<string[] | null> => {
  const url = new URL("/api/blog-publish/log", blogStatsBaseUrl());
  url.searchParams.set("file", file);
  url.searchParams.set("tail", "60");
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok: boolean; lines?: string[] };
    return data.ok && data.lines ? data.lines : null;
  } catch {
    return null;
  }
};

export const AccountActionsCard = () => {
  const qc = useQueryClient();
  const [pendingLogin, setPendingLogin] = useState<string | null>(null);
  const [pendingVerify, setPendingVerify] = useState<string | null>(null);
  const [verifyResults, setVerifyResults] = useState<
    Record<string, { ok: boolean; reason?: string } | undefined>
  >({});
  const [pendingPublish, setPendingPublish] = useState<string | "auto" | null>(null);
  const [msg, setMsg] = useState<ActionMsg | null>(null);
  const [activeLogFile, setActiveLogFile] = useState<string | null>(null);
  const [logLines, setLogLines] = useState<string[]>([]);
  const pollStartedAtRef = useRef<number | null>(null);

  const { data, isLoading, isError, error } = useBlogStats();
  const accounts = data?.accounts ?? [];

  // 발행 트리거 후 활성 logFile 의 tail 을 polling.
  useEffect(() => {
    if (!activeLogFile) return;
    pollStartedAtRef.current = Date.now();
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      const lines = await fetchLogTail(activeLogFile);
      if (!cancelled && lines) {
        setLogLines(lines);
        // 종료 시그널: "발행 ✓" 또는 "발행 실패" / "예상 못한 에러" / "exit 5" 등 마지막 줄에 자주 나옴.
        const joined = lines.slice(-5).join("\n");
        const done = /발행 ✓|발행 실패|예상 못한 에러|fatal|픽업할 패키지가 없어요|쿼터 마감/.test(joined);
        if (done) {
          qc.invalidateQueries({ queryKey: ["admin", "blog-queue-snapshot"] });
          qc.invalidateQueries({ queryKey: BLOG_STATS_QUERY_KEY });
        }
      }
      const elapsed = pollStartedAtRef.current ? Date.now() - pollStartedAtRef.current : 0;
      if (elapsed < LOG_POLL_MAX_MS) {
        setTimeout(tick, LOG_POLL_MS);
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [activeLogFile, qc]);

  const handleVerify = async (blogId: string) => {
    setPendingVerify(blogId);
    setVerifyResults((prev) => ({ ...prev, [blogId]: undefined }));
    try {
      const r = await callVerify(blogId);
      setVerifyResults((prev) => ({ ...prev, [blogId]: { ok: r.ok, reason: r.reason } }));
      qc.invalidateQueries({ queryKey: BLOG_STATS_QUERY_KEY });
    } finally {
      setPendingVerify(null);
    }
  };

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
      qc.invalidateQueries({ queryKey: BLOG_STATS_QUERY_KEY });
    }
  };

  const runPublish = async (target: string | null) => {
    const key = target ?? "auto";
    setPendingPublish(key);
    setMsg({
      kind: "info",
      text: target ? `${target} 발행 트리거 중…` : "발행 트리거 중 (자동 계정 픽)…",
    });
    setLogLines([]);
    setActiveLogFile(null);
    try {
      const r = await triggerPublish(target);
      if (r.ok) {
        const headlessNote = r.headless ? "(headless)" : "(브라우저 창 확인)";
        setMsg({
          kind: "success",
          text: `${r.blogId} 발행 시작 ${headlessNote}. pid=${r.pid}. 로그 polling 시작…`,
        });
        if (r.logFile) setActiveLogFile(r.logFile);
        qc.invalidateQueries({ queryKey: ["admin", "blog-queue-snapshot"] });
        qc.invalidateQueries({ queryKey: BLOG_STATS_QUERY_KEY });
      } else {
        setMsg({ kind: "error", text: `발행 트리거 실패: ${r.reason ?? "unknown"}` });
      }
    } catch (e) {
      setMsg({ kind: "error", text: `트리거 호출 오류: ${e instanceof Error ? e.message : String(e)}` });
    } finally {
      setPendingPublish(null);
    }
  };

  const handlePublishNext = () => runPublish(null);
  const handlePublishAccount = (blogId: string) => runPublish(blogId);

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
          disabled={pendingPublish !== null || allMaxed || accounts.length === 0}
          className="h-9 cursor-pointer rounded-xl bg-gray-900 px-4 text-xs font-bold text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {pendingPublish === "auto" ? "트리거 중…" : "다음 패키지 발행 (자동)"}
        </button>
      </header>

      {isLoading && <p className="text-xs text-gray-500">계정 목록 조회 중…</p>}

      {isError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          recipioReview 응답 실패: {error instanceof Error ? error.message : "unknown"}
          <br />
          <span className="text-[10px] text-red-500">
            `cd recipioReview && npm run dev` (port 3002) 떠 있는지 확인.
          </span>
        </p>
      )}

      {data && accounts.length === 0 && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          recipioReview 응답 OK인데 등록 계정 0개 — `.env`에 `NAVER_BLOG_IDS=acc1,acc2` 설정 후 재시작.
        </p>
      )}

      {accounts.length > 0 && (
        <ul className="space-y-1">
          {accounts.map((a) => {
            const badge = ageBadge(a.loginStatus.ageHours, a.loginStatus.exists);
            const verify = verifyResults[a.blogId];
            return (
              <li
                key={a.blogId}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{a.blogId}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${badge.cls}`}>
                    {badge.text}
                  </span>
                  {verify?.ok === true && (
                    <span className="text-[10px] text-emerald-600">✓ 활성</span>
                  )}
                  {verify?.ok === false && (
                    <span
                      className="text-[10px] text-red-600"
                      title={verify.reason}
                    >
                      ✗ {verify.reason ?? "만료"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleVerify(a.blogId)}
                    disabled={pendingVerify === a.blogId}
                    className="h-7 cursor-pointer rounded-lg border border-gray-300 bg-white px-2 text-[11px] hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                    title="실제 네이버 write 페이지로 redirect 검증 (5~10초)"
                  >
                    {pendingVerify === a.blogId ? "확인 중…" : "✓ 확인"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogin(a.blogId)}
                    disabled={pendingLogin === a.blogId}
                    className="h-7 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-[11px] hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    {pendingLogin === a.blogId ? "대기 중…" : "🔑 로그인"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePublishAccount(a.blogId)}
                    disabled={pendingPublish !== null || a.remaining === 0}
                    className="h-7 cursor-pointer rounded-lg bg-gray-900 px-3 text-[11px] font-semibold text-white active:scale-[0.98] hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    title={a.remaining === 0 ? "오늘 quota 마감" : `${a.blogId} 로 다음 본인용 패키지 발행`}
                  >
                    {pendingPublish === a.blogId ? "트리거 중…" : "📤 발행"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {msg && <p className={`rounded-lg px-3 py-2 text-[11px] ${msgClass}`}>{msg.text}</p>}

      {activeLogFile && (
        <details open className="rounded-lg border border-gray-200">
          <summary className="cursor-pointer px-3 py-2 text-[11px] font-medium text-gray-700">
            📄 로그 tail — {activeLogFile} ({logLines.length} lines)
          </summary>
          <pre className="max-h-64 overflow-auto rounded-b-lg bg-gray-900 px-3 py-2 text-[10px] leading-snug text-gray-100">
            {logLines.length === 0 ? "(아직 출력 없음…)" : logLines.join("\n")}
          </pre>
        </details>
      )}
    </section>
  );
};
