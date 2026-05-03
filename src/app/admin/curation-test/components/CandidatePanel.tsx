"use client";

import { useEffect, useState } from "react";

import { useCurationStore } from "../lib/store";

type AllowlistEntry = { params: Record<string, string | number> };

const ALLOWLIST_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/seo/allowlist.json";

export const CandidatePanel = () => {
  const [entries, setEntries] = useState<AllowlistEntry[]>([]);
  const [filter, setFilter] = useState("");
  const setSelected = useCurationStore((s) => s.setSelected);

  useEffect(() => {
    fetch(ALLOWLIST_URL)
      .then((r) => r.json())
      .then((j) => setEntries((j.pages ?? []) as AllowlistEntry[]))
      .catch(() => setEntries([]));
  }, []);

  const filtered = filter
    ? entries.filter((e) => JSON.stringify(e.params).includes(filter))
    : entries;

  return (
    <aside className="border-r overflow-y-auto p-3 space-y-2">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder="필터 (params 텍스트)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <p className="text-xs text-gray-500">{filtered.length}건</p>
      <ul className="space-y-1">
        {filtered.map((e, i) => (
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
