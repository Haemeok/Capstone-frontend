"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useCurationStore } from "../lib/store";

type AllowlistEntry = { params: Record<string, string | number> };

const ALLOWLIST_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/seo/allowlist.json";

const VISIBLE_LIMIT = 200;

export const CandidatePanel = () => {
  const [entries, setEntries] = useState<AllowlistEntry[]>([]);
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const setSelected = useCurationStore((s) => s.setSelected);

  useEffect(() => {
    fetch(ALLOWLIST_URL)
      .then((r) => r.json())
      .then((j) => {
        setEntries((j.pages ?? []) as AllowlistEntry[]);
        setLoading(false);
      })
      .catch(() => {
        setErrored(true);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!deferredFilter) return entries;
    const q = deferredFilter.toLowerCase();
    const out: AllowlistEntry[] = [];
    for (const e of entries) {
      if (JSON.stringify(e.params).toLowerCase().includes(q)) {
        out.push(e);
        if (out.length >= VISIBLE_LIMIT) break;
      }
    }
    return out;
  }, [entries, deferredFilter]);

  const visible = deferredFilter ? filtered : entries.slice(0, VISIBLE_LIMIT);
  const total = entries.length;

  return (
    <aside className="border-r overflow-y-auto p-3 space-y-2">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={`필터 (총 ${total.toLocaleString()}건)`}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        {loading
          ? "로드 중..."
          : errored
            ? "allowlist 로드 실패"
            : deferredFilter
              ? `매칭 ${visible.length}건 표시 (최대 ${VISIBLE_LIMIT}건)`
              : `상위 ${visible.length}건 표시 / 전체 ${total.toLocaleString()}건. 필터로 좁혀 보세요`}
      </p>
      <ul className="space-y-1">
        {visible.map((e, i) => (
          <li key={i}>
            <button
              type="button"
              className="w-full text-left text-sm hover:bg-gray-100 rounded px-2 py-1"
              onClick={() => setSelected(e.params)}
            >
              {JSON.stringify(e.params)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
